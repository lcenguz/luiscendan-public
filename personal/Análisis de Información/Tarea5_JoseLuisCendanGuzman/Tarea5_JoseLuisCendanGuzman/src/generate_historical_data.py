"""
Script para generar datos históricos sintéticos de precios de supermercados.
Genera 6-12 meses de datos históricos basados en las tablas de dimensiones.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import json

# Configuración
DATA_RAW_DIR = os.path.join("data", "raw")
OUTPUT_FILE = os.path.join(DATA_RAW_DIR, "precios_historicos.csv")
PRODUCTS_FILE = os.path.join(DATA_RAW_DIR, "productos.csv")
SUPERMARKETS_FILE = os.path.join(DATA_RAW_DIR, "supermercados.json")
MONTHS_HISTORY = 12  # Generar 12 meses de histórico

def load_dimensions():
    """Carga las tablas de dimensiones (Productos y Supermercados)."""
    # Cargar Productos
    if not os.path.exists(PRODUCTS_FILE):
        raise FileNotFoundError(f"No se encuentra el archivo de productos: {PRODUCTS_FILE}")
    
    df_products = pd.read_csv(PRODUCTS_FILE)
    products = df_products.to_dict('records')
    
    # Cargar Supermercados
    if not os.path.exists(SUPERMARKETS_FILE):
        raise FileNotFoundError(f"No se encuentra el archivo de supermercados: {SUPERMARKETS_FILE}")
        
    with open(SUPERMARKETS_FILE, 'r', encoding='utf-8') as f:
        supermarkets = json.load(f)
        
    return products, supermarkets

def generate_price_with_trend(base_price, month_offset, volatility, has_seasonality=False):
    """
    Genera un precio con tendencia temporal y variación aleatoria.
    """
    # Tendencia general (inflación del 3% anual)
    annual_inflation = 0.03
    trend = base_price * (1 + (annual_inflation * month_offset / 12))
    
    # Variación aleatoria
    random_variation = np.random.normal(0, volatility * base_price)
    
    # Estacionalidad (más caro en noviembre-diciembre)
    seasonal_factor = 1.0
    if has_seasonality:
        current_date = datetime.now() + timedelta(days=30 * month_offset)
        month = current_date.month
        if month in [11, 12]:  # Noviembre y Diciembre
            seasonal_factor = 1.10  # 10% más caro
        elif month in [1, 2]:  # Enero y Febrero
            seasonal_factor = 0.95  # 5% más barato
    
    price = trend + random_variation
    price = price * seasonal_factor
    
    # Asegurar que el precio no sea negativo
    return max(price, base_price * 0.5)

def generate_historical_data():
    """
    Genera datos históricos de precios usando las dimensiones cargadas.
    """
    print(f"Generando {MONTHS_HISTORY} meses de datos históricos...")
    
    try:
        products, supermarkets = load_dimensions()
        print(f"[INFO] Cargados {len(products)} productos y {len(supermarkets)} supermercados.")
    except Exception as e:
        print(f"[ERROR] {e}")
        return pd.DataFrame()
    
    records = []
    
    # Generar datos para cada mes
    for month_offset in range(-MONTHS_HISTORY, 1):  # De -12 a 0 (presente)
        # Calcular fecha
        date = datetime.now() + timedelta(days=30 * month_offset)
        date_str = date.strftime("%Y-%m-%d")
        
        # Para cada producto
        for prod in products:
            # Para cada supermercado
            for sup in supermarkets:
                
                # Calcular precio base ajustado por el factor del supermercado
                adjusted_base_price = prod["precio_base"] * sup["factor_precio"]
                
                price = generate_price_with_trend(
                    adjusted_base_price,
                    month_offset,
                    prod["volatilidad"],
                    prod["estacionalidad"] # Read directly as boolean from CSV/DataFrame logic might need adjustment if string
                )
                
                # Redondear a 2 decimales
                price = round(price, 2)
                
                records.append({
                    "Fecha": date_str,
                    "ID_Producto": prod["id_producto"],
                    "ID_Supermercado": sup["id_supermercado"],
                    "Precio": price,
                    # Dejamos estos campos para validación visual rápida, aunque en modelo estricto sobrarían
                    "Nombre_Producto": prod["nombre"],
                    "Nombre_Supermercado": sup["nombre"]
                })
    
    # Crear DataFrame
    df = pd.DataFrame(records)
    
    # Guardar a CSV
    os.makedirs(DATA_RAW_DIR, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)
    
    print(f"\n[OK] Datos historicos generados exitosamente!")
    print(f"[ARCHIVO] {OUTPUT_FILE}")
    print(f"[REGISTROS] Total: {len(df)}")
    
    # Mostrar muestra
    print("\n[MUESTRA] Primeros registros:")
    print(df.head())
    
    return df

def main():
    print("=" * 60)
    print("GENERADOR DE DATOS HISTÓRICOS (Model-Driven) - Smart Shopping")
    print("=" * 60)
    
    df = generate_historical_data()
    
    if not df.empty:
        print("\n[ESTADISTICAS] Por producto:")
        stats = df.groupby('Nombre_Producto')['Precio'].agg(['mean', 'min', 'max', 'std'])
        stats.columns = ['Precio Medio', 'Precio Min', 'Precio Max', 'Desv. Est.']
        print(stats.round(2))

if __name__ == "__main__":
    main()
