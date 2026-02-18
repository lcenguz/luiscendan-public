"""
analysis.py
-----------
Aquí están las funciones para calcular estadísticas.
Conteos, tops y agrupaciones.

Autor: Luis Cendán
"""

import pandas as pd

def contenido_por_tipo(df):
    """
    Calcula cuántos títulos hay de cada tipo (Movie, TV Show).
    """
    return df['type'].value_counts()


def contenido_por_anio(df):
    """
    Calcula cuántos títulos se publicaron en cada año, ordenados cronológicamente.
    """
    return df['release_year'].value_counts().sort_index()


def top_paises(df, n=5):
    """
    Devuelve los n países con más contenido.
    """
    return df['country'].value_counts().head(n)


def top_generos(df, n=5):
    """
    Calcula cuántos títulos hay por género.
    Importante: separa los géneros si vienen juntos con comas.
    """
    # Separamos los géneros por coma y expandimos la lista (explode)
    # así contamos cada uno por separado.
    generos = df['listed_in'].str.split(', ').explode()
    return generos.value_counts().head(n)


def contenido_por_rating(df):
    """
    Calcula cuántos títulos hay por cada rating.
    """
    return df['rating'].value_counts()
