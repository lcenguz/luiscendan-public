"""
visualization.py
----------------
Fichero para pintar las gráficas con seaborn y matplotlib.
Cada función crea un gráfico y lo guarda en la carpeta 'graphs'.

Autor: Luis Cendán
"""

import seaborn as sns
import matplotlib.pyplot as plt
import os
from analysis import contenido_por_rating, top_generos

def grafico_contenido_por_tipo(df, save_dir='graphs'):
    """
    Gráfico de barras: Películas vs Series.
    """
    try:
        plt.figure(figsize=(8, 6))
        sns.countplot(data=df, x='type', hue='type', palette='viridis', legend=False)
        plt.title('Distribución de Contenido por Tipo')
        plt.xlabel('Tipo')
        plt.ylabel('Cantidad')
        
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, 'contenido_por_tipo.png')
        plt.savefig(save_path)
        plt.close()
        print(f"   Gráfico guardado en: {save_path}")
    except Exception as e:
        print(f"   [ERROR] No se pudo generar el gráfico de contenido por tipo: {e}")


def grafico_contenido_por_anio(df, save_dir='graphs'):
    """
    Genera un gráfico de líneas con la evolución del número de títulos por año y lo guarda.
    """
    try:
        # Primero agregamos los datos
        conteo_anio = df['release_year'].value_counts().sort_index()
        
        plt.figure(figsize=(12, 6))
        sns.lineplot(x=conteo_anio.index, y=conteo_anio.values, marker='o')
        plt.title('Evolución del Contenido por Año')
        plt.xlabel('Año')
        plt.ylabel('Cantidad de Títulos')
        plt.grid(True)
        
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, 'contenido_por_anio.png')
        plt.savefig(save_path)
        plt.close()
        print(f"   Gráfico guardado en: {save_path}")
    except Exception as e:
        print(f"   [ERROR] No se pudo generar el gráfico de evolución por año: {e}")


def grafico_top_paises(df, n=5, save_dir='graphs'):
    """
    Genera un gráfico de barras con los n países con más títulos y lo guarda.
    """
    try:
        top_c = df['country'].value_counts().head(n)
        
        plt.figure(figsize=(10, 6))
        sns.barplot(x=top_c.values, y=top_c.index, hue=top_c.index, palette='magma', legend=False)
        plt.title(f'Top {n} Países con más Contenido')
        plt.xlabel('Cantidad')
        plt.ylabel('País')
        
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, 'top_paises.png')
        plt.savefig(save_path)
        plt.close()
        print(f"   Gráfico guardado en: {save_path}")
    except Exception as e:
        print(f"   [ERROR] No se pudo generar el gráfico de top países: {e}")


def grafico_distribucion_duracion(df, save_dir='graphs'):
    """
    Histograma de la distribución de duración guardado como imagen.
    """
    try:
        # Filtramos nulos en duration_num
        df_clean = df.dropna(subset=['duration_num'])
        
        plt.figure(figsize=(12, 6))
        sns.histplot(data=df_clean, x='duration_num', hue='type', multiple='stack', bins=30, palette='coolwarm')
        plt.title('Distribución de la Duración (Minutos / Temporadas)')
        plt.xlabel('Duración')
        plt.ylabel('Frecuencia')
        
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, 'distribucion_duracion.png')
        plt.savefig(save_path)
        plt.close()
        print(f"   Gráfico guardado en: {save_path}")
    except Exception as e:
        print(f"   [ERROR] No se pudo generar el gráfico de distribución de duración: {e}")


def grafico_contenido_por_rating(df, save_dir='graphs'):
    """
    Gráfico de barras del número de títulos por rating guardado como imagen.
    """
    try:
        plt.figure(figsize=(12, 6))
        # Ordenamos por cantidad para mejor visualización
        order = df['rating'].value_counts().index
        sns.countplot(data=df, x='rating', order=order, hue='rating', palette='pastel', legend=False)
        plt.title('Distribución de Contenido por Rating')
        plt.xlabel('Rating')
        plt.ylabel('Cantidad')
        plt.xticks(rotation=45)
        
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, 'contenido_por_rating.png')
        plt.savefig(save_path)
        plt.close()
        print(f"   Gráfico guardado en: {save_path}")
    except Exception as e:
        print(f"   [ERROR] No se pudo generar el gráfico de contenido por rating: {e}")


def grafico_top_generos(df, n=5, save_dir='graphs'):
    """
    Gráfico de barras de los n géneros más frecuentes guardado como imagen.
    """
    # Reutilizamos la lógica de split y explode, o podemos llamar a la funcion de analisis si queremos estandarizar
    # Pero visualización suele recibir el df.
    # Dado que analysis.py tiene 'top_generos', podemos usarla para obtener los datos.
    
    try:
        # Usamos la función de analisis para obtener los datos
        # Nota: top_generos devuelve una Serie pandas
        top_g = top_generos(df, n)
        
        plt.figure(figsize=(10, 6))
        sns.barplot(x=top_g.values, y=top_g.index, hue=top_g.index, palette='Spectral', legend=False)
        plt.title(f'Top {n} Géneros más Frecuentes')
        plt.xlabel('Cantidad')
        plt.ylabel('Género')
        
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, 'top_generos.png')
        plt.savefig(save_path)
        plt.close()
        print(f"   Gráfico guardado en: {save_path}")
    except Exception as e:
        print(f"   [ERROR] No se pudo generar el gráfico de top géneros: {e}")
