# Fundamentos de R - Ejercicio entregable
# Practica 1

cargar_dataset <- function(ruta_csv) {
  # Control de errores en lectura
  tryCatch(
    read.csv(ruta_csv, stringsAsFactors = FALSE),
    error = function(e) stop("Error al leer el csv: ", e$message)
  )
}

validar_estructura <- function(df) {
  if (!is.data.frame(df)) {
    FALSE
  } else {
    col_esperadas <- c("id", "edad", "nota", "asistencia")
    all(col_esperadas %in% names(df))
  }
}

limpiar_dataset <- function(df) {
  df[!is.na(df$nota) & !is.na(df$asistencia), ]
}

validar_valores <- function(df) {
  notas_ok <- all(df$nota >= 0 & df$nota <= 10)
  asistencia_ok <- all(df$asistencia >= 0 & df$asistencia <= 1)
  
  notas_ok && asistencia_ok
}

clasificar_nota <- function(nota) {
  if (nota < 5) {
    "Suspenso"
  } else if (nota >= 5 && nota < 7) {
    "Aprobado"
  } else if (nota >= 7 && nota < 9) {
    "Notable"
  } else {
    "Sobresaliente"
  }
}

agregar_clasificacion <- function(df) {
  df$categoria <- sapply(df$nota, clasificar_nota)
  df
}

estadisticas_basicas <- function(vector) {
  list(
    media = mean(vector), 
    minimo = min(vector), 
    maximo = max(vector)
  )
}

estadisticas_por_categoria <- function(df) {
  categorias <- unique(df$categoria)
  
  # Usamos lapply para iterar de forma eficiente
  resultados <- lapply(categorias, function(cat) {
    notas_cat <- df$nota[df$categoria == cat]
    estadisticas_basicas(notas_cat)
  })
  
  names(resultados) <- categorias
  resultados
}

ranking_estudiantes <- function(df, top_n = 5) {
  df_ordenado <- df[order(-df$nota), ]
  head(df_ordenado, top_n)
}

clasificar_edad <- function(edad) {
  if (edad < 20) {
    "Menores de 20"
  } else if (edad >= 20 && edad <= 22) {
    "20 a 22"
  } else {
    "Mayores de 22"
  }
}

analisis_por_edad <- function(df) {
  df$tramo_edad <- sapply(df$edad, clasificar_edad)
  tramos <- unique(df$tramo_edad)
  
  resultados <- lapply(tramos, function(tramo) {
    notas_tramo <- df$nota[df$tramo_edad == tramo]
    estadisticas_basicas(notas_tramo)
  })
  
  names(resultados) <- tramos
  resultados
}

resumen_final <- function(df) {
  res <- list(
    resumen_general = list(
      total_estudiantes = nrow(df),
      estadisticas_nota = estadisticas_basicas(df$nota)
    ),
    por_categoria = estadisticas_por_categoria(df),
    por_edad = analisis_por_edad(df),
    ranking = ranking_estudiantes(df),
    baja_asistencia = df[df$asistencia < 0.75, ]
  )
  
  # Clase S3 para formateo personalizado al imprimir
  class(res) <- "resumen_notas"
  res
}

print.resumen_notas <- function(x) {
  cat("\n========================================\n")
  cat("       RESUMEN DE NOTAS Y ASISTENCIA      \n")
  cat("========================================\n")
  
  cat("\n--- INFORMACION GENERAL ---\n")
  cat("Total Estudiantes:", x$resumen_general$total_estudiantes, "\n")
  cat("Nota Media Global:", round(x$resumen_general$estadisticas_nota$media, 2), "\n")
  
  cat("\n--- POR CATEGORIA ---\n")
  for(cat_name in names(x$por_categoria)) {
    stats <- x$por_categoria[[cat_name]]
    cat(sprintf("%-15s | Media: %5.2f | Min: %4.1f | Max: %4.1f\n", 
                cat_name, stats$media, stats$minimo, stats$maximo))
  }
  
  cat("\n--- POR TRAMO DE EDAD ---\n")
  for(tramo in names(x$por_edad)) {
    stats <- x$por_edad[[tramo]]
    cat(sprintf("%-15s | Media: %5.2f\n", tramo, stats$media))
  }
  
  cat("\n--- TOP ESTUDIANTES ---\n")
  print(x$ranking[, c("id", "nota", "categoria")])
  
  if(nrow(x$baja_asistencia) > 0) {
    cat("\n[!] ALERTA: BAJA ASISTENCIA (< 75%) ---\n")
    print(x$baja_asistencia[, c("id", "asistencia")])
  } else {
    cat("\n--- ASISTENCIA CORRECTA EN TODOS LOS ALUMNOS ---\n")
  }
  
  cat("\n========================================\n")
}

main <- function() {
  # Ajuste automatico de directorio (opcional)
  tryCatch(
    setwd("D:/Github/luiscendan-private/luiscendan-private/estudios/master/1º_cuatrimestre/SM141504_Programacion_BigData/practicas/Entregas/R/Entrega1/TODO"),
    error = function(e) warning("No se pudo cambiar el directorio. Comprueba la ruta.")
  )
  
  ruta_csv <- "estudiantes.csv"
  
  if (!file.exists(ruta_csv)) {
    stop(paste0("No encuentro 'estudiantes.csv' en: ", getwd(), 
                "\nUsa setwd() para ir a la carpeta correcta."))
  }
  
  df <- cargar_dataset(ruta_csv)
  
  if (!validar_estructura(df)) stop("Estructura incorrecta")
  
  df <- limpiar_dataset(df)
  
  if (!validar_valores(df)) stop("Valores fuera de rango")
  
  df <- agregar_clasificacion(df)
  
  resumen <- resumen_final(df)
  print(resumen)
}

main()
