"""
data_loader.py
--------------
Funciones para cargar el archivo CSV.
Controlamos errores típicos como que el archivo no exista o esté vacío.

Autor: Luis Cendán
"""

import pandas as pd
import os
from pandas.errors import EmptyDataError, ParserError

def cargar_dataset(ruta_csv):
    """
    Carga el archivo CSV indicado por la ruta recibida como parametro.
    """
    if not os.path.exists(ruta_csv):
        raise FileNotFoundError(f"El archivo {ruta_csv} no existe.")
    
    try:
        df = pd.read_csv(ruta_csv)
        if df.empty:
            print("   [WARNING] El dataset se cargó pero está vacío.")
        else:
            print(f"Dataset cargado correctamente: {df.shape[0]} filas, {df.shape[1]} columnas")
        return df
    except FileNotFoundError:
        print(f"Error: No encuentro el archivo en {ruta_csv}")
        return None
    except EmptyDataError:
        print("Error: El archivo CSV está vacío.")
        return None
    except ParserError:
        print("Error: El formato del CSV está mal y no puedo leerlo.")
        return None
    except Exception as e:
        print(f"Error raro al cargar: {e}")
        return None


def exploracion_inicial(df):
    """
    Muestra las primeras filas y un resumen de las columnas
    para ver qué pinta tienen los datos.
    """
    print("\n--- Exploración Inicial ---")
    print("\nPrimeras 5 filas:")
    print(df.head())
    
    print("\nInformación del DataFrame:")
    print(f"Filas: {df.shape[0]}")
    print(f"Columnas: {df.shape[1]}")
    
    print("\nTipos de datos:")
    print(df.dtypes)
    
    print("\nValores nulos por columna:")
    print(df.isnull().sum())
    print("\n---------------------------\n")
