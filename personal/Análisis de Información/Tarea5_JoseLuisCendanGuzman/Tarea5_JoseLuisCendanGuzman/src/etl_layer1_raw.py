"""
ETL Layer 1: RAW/STG (Stage)
Carga datos en bruto sin transformaciones a MongoDB.
"""

import os
import json
import pandas as pd
from pymongo import MongoClient
from datetime import datetime

class ETL_Layer1_RAW:
    """
    Capa 1: RAW/STG
    - Carga datos en bruto sin transformaciones
    - Preserva estructura original
    - Almacena en MongoDB colección 'raw_prices'
    """
    
    def __init__(self, mongo_uri="mongodb://root:example@localhost:27017/"):
        """
        Inicializa conexión a MongoDB.
        
        Args:
            mongo_uri: URI de conexión a MongoDB
        """
        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client['shopping_db']
            self.collection = self.db['raw_prices']
            print("[OK] Conexion a MongoDB establecida")
        except Exception as e:
            print(f"[ERROR] No se pudo conectar a MongoDB: {e}")
            print("[INFO] Asegurate de que Docker Desktop este corriendo")
            print("[INFO] Ejecuta: docker-compose up -d")
            raise
    
    def load_csv_to_raw(self, csv_path, source_name):
        """
        Carga un archivo CSV a la colección RAW.
        
        Args:
            csv_path: Ruta del archivo CSV
            source_name: Nombre de la fuente de datos
        
        Returns:
            Número de registros insertados
        """
        print(f"\n[CARGANDO] {csv_path}")
        
        if not os.path.exists(csv_path):
            print(f"[ERROR] Archivo no encontrado: {csv_path}")
            return 0
        
        # Leer CSV
        df = pd.read_csv(csv_path)
        print(f"[INFO] {len(df)} registros leidos del CSV")
        
        # Añadir metadatos
        df['_loaded_at'] = datetime.now()
        df['_source_file'] = os.path.basename(csv_path)
        df['_source_name'] = source_name
        
        # Convertir a diccionarios
        records = df.to_dict('records')
        
        # Insertar en MongoDB
        if records:
            result = self.collection.insert_many(records)
            print(f"[OK] {len(result.inserted_ids)} registros insertados en 'raw_prices'")
            return len(result.inserted_ids)
        else:
            print("[WARNING] No hay registros para insertar")
            return 0
    
    def load_json_to_raw(self, json_path, source_name):
        """
        Carga un archivo JSON a la colección RAW.
        
        Args:
            json_path: Ruta del archivo JSON
            source_name: Nombre de la fuente
        
        Returns:
            Número de registros insertados
        """
        print(f"\n[CARGANDO] {json_path}")
        
        if not os.path.exists(json_path):
            print(f"[ERROR] Archivo no encontrado: {json_path}")
            return 0
        
        # Leer JSON
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Si es una lista, procesar cada elemento
        if isinstance(data, list):
            records = data
        else:
            records = [data]
        
        # Añadir metadatos
        for record in records:
            record['_loaded_at'] = datetime.now()
            record['_source_file'] = os.path.basename(json_path)
            record['_source_name'] = source_name
        
        # Insertar en MongoDB
        if records:
            result = self.collection.insert_many(records)
            print(f"[OK] {len(result.inserted_ids)} registros insertados en 'raw_prices'")
            return len(result.inserted_ids)
        else:
            print("[WARNING] No hay registros para insertar")
            return 0
    
    def clear_raw_collection(self):
        """Limpia la colección RAW (útil para testing)."""
        result = self.collection.delete_many({})
        print(f"[INFO] {result.deleted_count} registros eliminados de 'raw_prices'")
    
    def get_raw_stats(self):
        """Obtiene estadísticas de la colección RAW."""
        total = self.collection.count_documents({})
        
        # Contar por fuente
        pipeline = [
            {"$group": {"_id": "$_source_name", "count": {"$sum": 1}}}
        ]
        by_source = list(self.collection.aggregate(pipeline))
        
        print("\n" + "=" * 70)
        print(" ESTADISTICAS DE CAPA RAW")
        print("=" * 70)
        print(f"\n[TOTAL] {total} registros en 'raw_prices'")
        print("\n[POR FUENTE]")
        for item in by_source:
            print(f"   {item['_id']:30} {item['count']:6} registros")
    
    def run_etl_layer1(self):
        """
        Ejecuta el ETL completo de la Capa 1.
        Carga las dimensiones y la tabla de hechos a MongoDB.
        """
        print("=" * 70)
        print(" ETL LAYER 1: RAW/STG (Modelo Estrella)")
        print("=" * 70)
        
        total_inserted = 0
        
        # 1. Cargar Dimension Productos
        print("\n[DIMENSION] Cargando Productos...")
        products_path = "data/raw/productos.csv"
        # Cambiar colección destino temporalmente para carga
        original_collection = self.collection
        self.collection = self.db['raw_products']
        self.collection.delete_many({}) # Limpiar antes de cargar
        if os.path.exists(products_path):
            count = self.load_csv_to_raw(products_path, "dim_productos")
            print(f"[OK] Dimension Productos cargada: {count} registros")
        
        # 2. Cargar Dimension Supermercados
        print("\n[DIMENSION] Cargando Supermercados...")
        supermarkets_path = "data/raw/supermercados.json"
        self.collection = self.db['raw_supermarkets']
        self.collection.delete_many({}) # Limpiar antes de cargar
        if os.path.exists(supermarkets_path):
            count = self.load_json_to_raw(supermarkets_path, "dim_supermercados")
            print(f"[OK] Dimension Supermercados cargada: {count} registros")
            
        # 3. Cargar Tabla de Hechos (Precios Históricos)
        print("\n[FACTS] Cargando Precios Historicos...")
        facts_path = "data/raw/precios_historicos.csv"
        self.collection = self.db['raw_prices'] # Restaurar colección principal
        self.collection.delete_many({}) # Limpiar antes de cargar
        if os.path.exists(facts_path):
            count = self.load_csv_to_raw(facts_path, "fact_precios_historicos")
            total_inserted = count
        
        # Mostrar estadísticas
        self.get_raw_stats()
        
        print(f"\n[RESUMEN] Total de hechos cargados: {total_inserted}")
        print("[OK] ETL Layer 1 completado")
        
        return total_inserted

def main():
    """Ejecuta el ETL de la Capa 1."""
    try:
        etl = ETL_Layer1_RAW()
        
        # Opcional: Limpiar colección antes de cargar
        # etl.clear_raw_collection()
        
        # Ejecutar ETL
        etl.run_etl_layer1()
        
    except Exception as e:
        print(f"\n[ERROR] ETL Layer 1 fallo: {e}")
        print("\n[SOLUCION]")
        print("1. Verifica que Docker Desktop este corriendo")
        print("2. Ejecuta: docker-compose up -d")
        print("3. Espera unos segundos y vuelve a intentar")

if __name__ == "__main__":
    main()
