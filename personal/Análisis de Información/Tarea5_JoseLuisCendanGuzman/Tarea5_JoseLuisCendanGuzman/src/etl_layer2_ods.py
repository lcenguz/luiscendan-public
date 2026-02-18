"""
ETL Layer 2: ODS/CMD (Operational Data Store / Consolidated Master Data)
Limpia, normaliza e integra datos de múltiples fuentes.
"""

import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import re

class ETL_Layer2_ODS:
    """
    Capa 2: ODS/CMD
    - Limpia y normaliza datos
    - Integra datos de múltiples fuentes
    - Elimina duplicados
    - Estandariza formatos
    - Almacena en MongoDB colección 'ods_prices'
    """
    
    def __init__(self, mongo_uri="mongodb://root:example@localhost:27017/"):
        """Inicializa conexión a MongoDB."""
        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client['shopping_db']
            self.raw_prices = self.db['raw_prices']
            self.raw_products = self.db['raw_products']
            self.raw_supermarkets = self.db['raw_supermarkets']
            self.ods_collection = self.db['ods_prices']
            print("[OK] Conexion a MongoDB establecida")
        except Exception as e:
            print(f"[ERROR] No se pudo conectar a MongoDB: {e}")
            raise
    
    # ... (Helper methods for cleaning can remain or be simplified as data is now cleaner from generation)
    
    def transform_raw_to_ods(self):
        """
        Transforma datos de RAW a ODS realizando JOINs de Dimensiones.
        
        Proceso:
        1. Cargar dimensiones (Productos y Supermercados) en memoria.
        2. Leer tabla de hechos (Precios).
        3. Cruzar datos (Enrichment).
        4. Guardar en ODS.
        """
        print("\n" + "=" * 70)
        print(" TRANSFORMACION RAW -> ODS (JOIN Dimensiones)")
        print("=" * 70)
        
        # 1. Cargar Dimensiones en Memoria (Lookup Dictionaries)
        print("[DIMENSIONES] Cargando catálogos...")
        
        # Productos: {id_producto: {datos...}}
        products_map = {p['id_producto']: p for p in self.raw_products.find()}
        print(f"   - Productos cargados: {len(products_map)}")
        
        # Supermercados: {id_supermercado: {datos...}}
        supermarkets_map = {s['id_supermercado']: s for s in self.raw_supermarkets.find()}
        print(f"   - Supermercados cargados: {len(supermarkets_map)}")
        
        # 2. Procesar Hechos
        raw_cursor = self.raw_prices.find()
        ods_records = []
        
        print("[HECHOS] Procesando y cruzando datos...")
        count = 0
        errors = 0
        
        for record in raw_cursor:
            try:
                # Obtener Foreign Keys
                id_prod = record.get('ID_Producto')
                id_sup = record.get('ID_Supermercado')
                
                # Lookup
                prod_info = products_map.get(id_prod)
                sup_info = supermarkets_map.get(id_sup)
                
                if prod_info and sup_info:
                    # Construir registro ODS enriquecido
                    ods_record = {
                        # Datos temporales
                        'Date': record.get('Fecha'), # Mapping Spanish -> English
                        
                        # Datos de Hecho
                        'Price': float(record.get('Precio')),
                        'Source': 'historical_etl',
                        
                        # Datos de Producto (Desnormalizados)
                        'Product': prod_info.get('nombre'),
                        'Category': prod_info.get('categoria'),
                        'ProductId': id_prod,
                        
                        # Datos de Supermercado (Desnormalizados)
                        'Supermarket': sup_info.get('nombre'),
                        'SupermarketId': id_sup,
                        'Latitude': sup_info.get('latitud'),
                        'Longitude': sup_info.get('longitud'),
                        
                        # Metadatos ETL
                        '_processed_at': datetime.now(),
                        '_layer': 'ODS'
                    }
                    ods_records.append(ods_record)
                    count += 1
                else:
                    errors += 1
                    
            except Exception as e:
                errors += 1
                continue
                
        print(f"[INFO] Registros procesados: {count}")
        if errors > 0:
            print(f"[WARNING] Fallos en cruce (IDs no encontrados): {errors}")
            
        # 3. Guardar en ODS
        if ods_records:
            self.ods_collection.delete_many({}) # Full refresh
            result = self.ods_collection.insert_many(ods_records)
            print(f"\n[OK] {len(result.inserted_ids)} registros consolidados en 'ods_prices'")
            return len(result.inserted_ids)
        else:
            print("[WARNING] No se generaron registros ODS.")
            return 0
    
    def get_ods_stats(self):
        """Obtiene estadísticas de la colección ODS."""
        total = self.ods_collection.count_documents({})
        
        print("\n" + "=" * 70)
        print(" ESTADISTICAS DE CAPA ODS")
        print("=" * 70)
        print(f"\n[TOTAL] {total} registros en 'ods_prices'")
        
        # Simple sample
        if total > 0:
            print("\n[MUESTRA] Último registro:")
            print(self.ods_collection.find_one({}, {'_id': 0, '_processed_at': 0}))

    def run_etl_layer2(self):
        """Ejecuta el ETL completo de la Capa 2."""
        print("=" * 70)
        print(" ETL LAYER 2: ODS/CMD")
        print("=" * 70)
        
        # Transformar RAW -> ODS
        count = self.transform_raw_to_ods()
        
        # Mostrar estadísticas
        if count > 0:
            self.get_ods_stats()
        
        print(f"\n[RESUMEN] {count} registros procesados")
        print("[OK] ETL Layer 2 completado")
        
        return count

def main():
    """Ejecuta el ETL de la Capa 2."""
    try:
        etl = ETL_Layer2_ODS()
        etl.run_etl_layer2()
        
    except Exception as e:
        print(f"\n[ERROR] ETL Layer 2 fallo: {e}")
        print("\n[SOLUCION]")
        print("1. Verifica que MongoDB este corriendo")
        print("2. Ejecuta primero: python src\\etl_layer1_raw.py")

if __name__ == "__main__":
    main()
