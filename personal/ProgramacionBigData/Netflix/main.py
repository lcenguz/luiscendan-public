"""
main.py
-------
Script principal del proyecto.
Desde aquí controlamos todo el proceso: carga, limpieza, análisis y gráficos.

Autor: Luis Cendán
"""

from data_loader import *
from data_cleaning import *
from analysis import *
from visualization import *

# BONUS: Descomentar si se implementa la clase analítica avanzada
# from netflix_analyzer import NetflixAnalyzer


def main():
    """
    Función principal.
    Organiza todo el trabajo llamando a las funciones de los otros ficheros.
    """
    print("=========================================")
    print("   ANÁLISIS DE DATOS DE NETFLIX")
    print("=========================================\n")

    # 1. Cargar los datos
    ruta_csv = "netflix_titles.csv"
    print(f"1. Cargando dataset desde: {ruta_csv}...")
    df = cargar_dataset(ruta_csv)
    
    if df is None:
        print("No se pudo cargar el dataset. Terminando ejecución.")
        return

    # 2. Exploración inicial
    print("\n2. Realizando exploración inicial...")
    try:
        exploracion_inicial(df)
        
        # 3. Limpiar los datos
        print("3. Limpiando y preparando datos...")
        df_clean = preparar_dataset(df)
        print("   Datos limpiados correctamente.")
        
        # 4. Analizar
        print("\n4. Ejecutando análisis de datos...")
        
        print("\n   --- Contenido por Tipo ---")
        type_counts = contenido_por_tipo(df_clean)
        print(type_counts)
        
        print("\n   --- Contenido por País (Top 5) ---")
        print(top_paises(df_clean))
        
        print("\n   --- Contenido por Rating ---")
        print(contenido_por_rating(df_clean).head()) # Mostramos head para no saturar
        
        # 5. Visualización
        print("\n5. Generando visualizaciones...")
        print("   Guardando gráficos en la carpeta 'graphs'...")
        
        grafico_contenido_por_tipo(df_clean)
        grafico_contenido_por_anio(df_clean)
        grafico_top_paises(df_clean)
        grafico_distribucion_duracion(df_clean)
        grafico_contenido_por_rating(df_clean)
        grafico_top_generos(df_clean)
        
        print("\n=========================================")
        print("   ANÁLISIS COMPLETADO")
        print("=========================================")
        
    except Exception as e:
        print(f"\n[ERROR] Ha fallado algo inesperado: {e}")
        
    finally:
        print("\n-----------------------------------------")
        print("   Fin del programa")
        print("-----------------------------------------")



if __name__ == "__main__":
    main()
