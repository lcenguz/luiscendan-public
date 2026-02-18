"""
data_cleaning.py
----------------
Funciones para limpiar y "arreglar" los datos.
Rellenamos nulos, quitamos duplicados y convertimos textos a números.

Autor: Luis Cendán
"""

import numpy as np
import pandas as pd
import re

def limpiar_columna_country(df):
    """
    Analiza la columna country, rellena nulos con 'Unknown' y queda con el primer pais.
    No modifica el DataFrame original.
    """
    df_clean = df.copy()
    
    # Verificar que la columna exista
    if 'country' not in df_clean.columns:
        return df_clean
        
    # Rellenar valores nulos
    df_clean['country'] = df_clean['country'].fillna('Unknown')
    
    # Quedarse con el primer país si hay varios (separados por coma)
    # Por ejemplo: 'United States, United Kingdom' -> nos quedamos solo con 'United States'
    df_clean['country'] = df_clean['country'].apply(lambda x: x.split(',')[0].strip() if isinstance(x, str) else x)
    
    return df_clean


def extraer_duracion_numerica(row):
    """
    Extrae el valor numérico de la duración.
    Maneja 'min' para películas y 'Season'/'Seasons' para series.
    """
    duration = row['duration']
    
    if pd.isna(duration):
        return np.nan
        
    # Usamos regex para sacar los números de la cadena
    # Ej: "90 min" -> 90, "1 Season" -> 1    
    match = re.search(r'(\d+)', str(duration))
    if match:
        return int(match.group(1))
    
    return np.nan


def limpiar_duracion(df):
    """
    Crea una nueva columna duration_num con el valor numérico.
    No modifica el DataFrame original.
    """
    df_clean = df.copy()
    # Aplicamos la función a cada fila si la columna existe.
    if 'duration' in df_clean.columns:
        # Usamos axis=1 para procesar por filas, permitiendo lógica compleja basada en múltiples columnas si fuera necesario.
        df_clean['duration_num'] = df_clean.apply(extraer_duracion_numerica, axis=1)
    else:
        # Si no existe, creamos la columna con NaN para evitar fallos aguas abajo
        df_clean['duration_num'] = np.nan
    
    return df_clean


def preparar_dataset(df):
    """
    Función que llama a todas las limpiezas en orden.
    """
    # Pipeline de limpieza
    # 1. Quitar duplicados por si acaso
    df = df.drop_duplicates()

    # 2. Arreglar columna country
    df_step1 = limpiar_columna_country(df)
    
    # 3. Arreglar duración
    df_final = limpiar_duracion(df_step1)
    
    return df_final
