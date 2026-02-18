"""
Script maestro que ejecuta todo el pipeline ETL completo.
Ejecuta las 3 capas en secuencia: RAW -> ODS -> DRV
"""

import sys
import time
import os
from dotenv import load_dotenv
from etl_layer1_raw import ETL_Layer1_RAW
from etl_layer2_ods import ETL_Layer2_ODS
from etl_layer3_drv import ETL_Layer3_DRV

# Cargar variables de entorno
load_dotenv()

def get_mongo_connection_string():
    """Obtiene la URI de conexión desde .env o usa default local."""
    uri = os.getenv("MONGO_URI")
    if not uri:
        print("[INFO] No se encontró MONGO_URI en .env, usando localhost por defecto.")
        return "mongodb://root:example@localhost:27017/"
    
    # Enmascarar password para log
    masked = uri.replace(uri.split("@")[0].split("//")[1], "***:***") if "@" in uri else "localhost"
    print(f"[CONFIG] Usando conexión a: {masked}")
    return uri

def check_mongodb_connection(uri):
    """Verifica que MongoDB esté accesible con la URI dada."""
    try:
        from pymongo import MongoClient
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("[OK] Conexión a MongoDB exitosa")
        return True
    except Exception as e:
        print(f"[ERROR] No se pudo conectar a MongoDB: {e}")
        return False

def run_complete_etl():
    """Ejecuta el pipeline ETL completo."""
    
    print("=" * 70)
    print(" PIPELINE ETL COMPLETO - Smart Shopping")
    print("=" * 70)
    
    # 1. Obtener configuración
    mongo_uri = get_mongo_connection_string()
    
    # 2. Verificar Conexión
    if not check_mongodb_connection(mongo_uri):
        return False
    
    try:
        # CAPA 1: RAW
        print("\n\n")
        print("#" * 70)
        print("# CAPA 1: RAW/STG")
        print("#" * 70)
        # PASAMOS LA URI AL CONSTRUCTOR
        etl1 = ETL_Layer1_RAW(mongo_uri)
        count1 = etl1.run_etl_layer1()
        
        if count1 == 0:
            print("\n[ERROR] No se cargaron datos en RAW")
            # Continuamos igual para ver si hay datos previos
        
        time.sleep(1)
        
        # CAPA 2: ODS
        print("\n\n")
        print("#" * 70)
        print("# CAPA 2: ODS/CMD")
        print("#" * 70)
        etl2 = ETL_Layer2_ODS(mongo_uri)
        count2 = etl2.run_etl_layer2()
        
        if count2 == 0:
            print("\n[WARNING] No se procesaron nuevos datos en ODS")
        
        time.sleep(1)
        
        # CAPA 3: DRV
        print("\n\n")
        print("#" * 70)
        print("# CAPA 3: DRV/EXP")
        print("#" * 70)
        etl3 = ETL_Layer3_DRV(mongo_uri)
        count3 = etl3.run_etl_layer3()
        
        # RESUMEN FINAL
        print("\n\n")
        print("=" * 70)
        print(" RESUMEN DEL PIPELINE ETL")
        print("=" * 70)
        print(f"\n[CAPA 1 - RAW] {count1} registros cargados")
        print(f"[CAPA 2 - ODS] {count2} registros procesados")
        print(f"[CAPA 3 - DRV] {count3} KPIs calculados")
        print("\n[OK] Pipeline ETL completado exitosamente")
        
        if "azure.com" in mongo_uri:
            print("\n[NUBE] Los datos se han subido a Azure Cosmos DB.")
            print("       Ve a Azure Portal > Data Explorer > Refresh para ver 'shopping_db'")
        else:
            print("\n[LOCAL] Accede a Mongo Express: http://localhost:8081")
        
        return True
        
    except Exception as e:
        print(f"\n[ERROR] Pipeline ETL fallo: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = run_complete_etl()
    sys.exit(0 if success else 1)
