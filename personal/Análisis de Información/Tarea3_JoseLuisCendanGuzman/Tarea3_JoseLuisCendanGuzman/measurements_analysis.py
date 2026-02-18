import math
import time
import sys
import os

#Detectar si estamos en Docker o Windows
if os.path.exists("/tmp/data/measurements.txt"):
    archivo_datos = "/tmp/data/measurements.txt"
    dir_base = "/tmp/data"
else:
    archivo_datos = "data/measurements.txt"
    dir_base = "data"

#Obtener modo y workers (spark, pandas, spark3)
modo = sys.argv[1] if len(sys.argv) > 1 else 'spark'

print("Análisis de temperaturas - Modo:", modo)

#Medir tiempo
inicio = time.time()

if modo == 'pandas':
    #Versión con Pandas para comparar rendimiento
    import pandas as pd
    
    df = pd.read_csv(archivo_datos, sep=";", 
                     names=["estacion", "temperatura"])
    
    stats = df.groupby("estacion")["temperatura"].agg(['min', 'mean', 'max'])
    stats = stats.sort_index()
    
    resultados = [(est, (row['min'], row['mean'], row['max'])) 
                  for est, row in stats.iterrows()]
    
    directorio = f"{dir_base}/results"

else:
    #Versión con Spark (procesamiento distribuido)
    #Se importa SparkContext y SparkConf
    from pyspark import SparkContext, SparkConf
    conf1 = SparkConf().setAppName("temperaturas")
    sc = SparkContext(conf = conf1).getOrCreate()
    
    #Cargar y parsear datos
    lineas = sc.textFile(archivo_datos)
    
    def parsear(linea):
        partes = linea.split(';')
        return (partes[0], float(partes[1]))
    
    mediciones = lineas.map(parsear)
    
    #Agrupar por estación y calcular estadísticas
    def calcular(temps):
        lista = list(temps)
        return (min(lista), sum(lista)/len(lista), max(lista))
    
    stats = mediciones.groupByKey().mapValues(calcular)
    
    #Ordenar alfabéticamente
    resultados = stats.sortByKey().collect()
    
    directorio = f"{dir_base}/results"
    sc.stop()

#Calcular tiempo
tiempo = time.time() - inicio

#Mostrar resultados
for estacion, (minima, promedio, maxima) in resultados:
    #Redondear hacia abajo a 1 decimal
    min_r = math.floor(minima * 10) / 10
    mean_r = math.floor(promedio * 10) / 10
    max_r = math.floor(maxima * 10) / 10
    print(f"{estacion}={min_r:.1f}/{mean_r:.1f}/{max_r:.1f}")

#Guardar resultados con nombre único
os.makedirs(directorio, exist_ok=True)

#Nombre de archivo según el modo
if modo == 'pandas':
    nombre_archivo = "resultados_pandas.txt"
elif modo == 'spark3':
    nombre_archivo = "resultados_spark_3w.txt"
else:
    nombre_archivo = "resultados_spark_1w.txt"

archivo = open(f"{directorio}/{nombre_archivo}", "w", encoding="utf-8")
for estacion, (minima, promedio, maxima) in resultados:
    min_r = math.floor(minima * 10) / 10
    mean_r = math.floor(promedio * 10) / 10
    max_r = math.floor(maxima * 10) / 10
    archivo.write(f"{estacion}={min_r:.1f}/{mean_r:.1f}/{max_r:.1f}\n")
archivo.close()

#Mostrar resumen
print(f"\nTiempo: {tiempo:.2f}s | Estaciones: {len(resultados)} | Modo: {modo}")
print(f"Resultados guardados en: {directorio}/{nombre_archivo}")
