"""
Análisis de Precios Interactivo - Busca supermercados cercanos a CUALQUIER dirección
El usuario introduce una dirección y el sistema busca automáticamente.

ENTREGA 5 - Smart Shopping
Autor: José Luis Cendán Guzmán
"""

import pandas as pd
import math
from pymongo import MongoClient
from datetime import datetime
import requests
import json

class AnalizadorPrecios:
    """Analizador de precios que busca supermercados cercanos a cualquier dirección."""
    
    def __init__(self, mongo_uri="mongodb://root:example@localhost:27017/"):
        """Inicializa conexión a MongoDB."""
        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client['shopping_db']
            print("[OK] Conectado a MongoDB")
        except Exception as e:
            print(f"[ERROR] No se pudo conectar a MongoDB: {e}")
            self.db = None
    
    def geocodificar_direccion(self, direccion):
        """
        Convierte una dirección en coordenadas usando Nominatim (OpenStreetMap).
        API gratuita, sin necesidad de API key.
        """
        print(f"\n[GEOCODING] Buscando coordenadas para: {direccion}")
        
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': direccion,
            'format': 'json',
            'limit': 1
        }
        headers = {
            'User-Agent': 'SmartShopping/1.0'
        }
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data:
                    lat = float(data[0]['lat'])
                    lon = float(data[0]['lon'])
                    nombre_completo = data[0].get('display_name', direccion)
                    print(f"[OK] Encontrado: {nombre_completo}")
                    print(f"[OK] Coordenadas: {lat}, {lon}")
                    return lat, lon, nombre_completo
                else:
                    print("[ERROR] No se encontraron resultados para esta dirección")
                    return None, None, None
            else:
                print(f"[ERROR] Error en geocodificación: {response.status_code}")
                return None, None, None
        except Exception as e:
            print(f"[ERROR] Error al geocodificar: {e}")
            return None, None, None
    
    def calcular_distancia(self, lat1, lon1, lat2, lon2):
        """Calcula distancia en km usando fórmula de Haversine."""
        R = 6371  # Radio de la Tierra en km
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c
    
    def buscar_supermercados_cercanos(self, lat, lon, radio_km=50):
        """Busca supermercados cercanos en MongoDB."""
        print(f"\n[BUSQUEDA] Buscando supermercados en radio de {radio_km} km...")
        
        if self.db is None:
            print("[ERROR] No hay conexión a MongoDB")
            return []
        
        # Obtener todos los supermercados
        supermercados = list(self.db['raw_supermarkets'].find())
        
        if not supermercados:
            print("[WARNING] No hay supermercados en la base de datos")
            return []
        
        # Calcular distancias
        resultados = []
        for super in supermercados:
            distancia = self.calcular_distancia(
                lat, lon,
                super['latitud'], super['longitud']
            )
            
            if distancia <= radio_km:
                resultados.append({
                    'id': super['id_supermercado'],
                    'nombre': super['nombre'],
                    'distancia_km': round(distancia, 2),
                    'latitud': super['latitud'],
                    'longitud': super['longitud']
                })
        
        # Ordenar por distancia
        resultados.sort(key=lambda x: x['distancia_km'])
        
        print(f"[OK] Encontrados {len(resultados)} supermercados cercanos")
        return resultados
    
    def obtener_precios_actuales(self):
        """Obtiene los precios más recientes de MongoDB."""
        print("\n[PRECIOS] Obteniendo precios actuales...")
        
        if self.db is None:
            return {}
        
        # Obtener datos de ODS (ya tienen JOIN de dimensiones)
        pipeline = [
            {'$sort': {'Date': -1}},
            {'$group': {
                '_id': {
                    'supermercado': '$Supermarket',
                    'producto': '$Product'
                },
                'precio': {'$first': '$Price'}
            }}
        ]
        
        datos = list(self.db['ods_prices'].aggregate(pipeline))
        
        # Organizar por supermercado
        precios = {}
        for item in datos:
            super = item['_id']['supermercado']
            producto = item['_id']['producto']
            precio = item['precio']
            
            if super not in precios:
                precios[super] = {}
            precios[super][producto] = precio
        
        print(f"[OK] Precios cargados para {len(precios)} supermercados")
        return precios
    
    def calcular_coste_cesta(self, supermercado_nombre, precios_dict):
        """Calcula el coste total de la cesta."""
        if supermercado_nombre not in precios_dict:
            return None
        
        total = sum(precios_dict[supermercado_nombre].values())
        return round(total, 2)
    
    def analizar_direccion(self, direccion, radio_km=50):
        """Analiza una dirección completa."""
        print("\n" + "=" * 80)
        print(" ANALISIS DE PRECIOS PARA TU DIRECCION")
        print("=" * 80)
        
        # 1. Geocodificar dirección
        lat, lon, nombre_completo = self.geocodificar_direccion(direccion)
        
        if lat is None:
            print("\n[ERROR] No se pudo geocodificar la dirección")
            print("[AYUDA] Intenta con una dirección más específica (calle, número, ciudad)")
            return None
        
        # 2. Buscar supermercados cercanos
        supermercados = self.buscar_supermercados_cercanos(lat, lon, radio_km)
        
        if not supermercados:
            print(f"\n[ERROR] No se encontraron supermercados en un radio de {radio_km} km")
            print("[AYUDA] Intenta aumentar el radio de búsqueda")
            return None
        
        # 3. Obtener precios
        precios = self.obtener_precios_actuales()
        
        # 4. Calcular costes
        resultados = []
        for super in supermercados:
            coste = self.calcular_coste_cesta(super['nombre'], precios)
            if coste:
                resultados.append({
                    'supermercado': super['nombre'],
                    'distancia_km': super['distancia_km'],
                    'coste_total': coste,
                    'productos': precios[super['nombre']]
                })
        
        if not resultados:
            print("\n[ERROR] No hay precios disponibles para los supermercados cercanos")
            return None
        
        # Ordenar por coste
        resultados.sort(key=lambda x: x['coste_total'])
        
        # 5. Mostrar resultados
        print("\n" + "=" * 80)
        print(" RESULTADOS DEL ANALISIS")
        print("=" * 80)
        print(f"\nDireccion analizada: {nombre_completo}")
        print(f"Coordenadas: {lat:.4f}, {lon:.4f}")
        print(f"Supermercados encontrados: {len(resultados)}")
        
        print("\n" + "-" * 80)
        print(f"{'Supermercado':<25} {'Distancia':<12} {'Coste Total':<15} {'Ahorro'}")
        print("-" * 80)
        
        coste_mas_caro = max(r['coste_total'] for r in resultados)
        
        for i, r in enumerate(resultados):
            ahorro = coste_mas_caro - r['coste_total']
            simbolo = ">>> " if i == 0 else "    "
            print(f"{simbolo}{r['supermercado']:<21} {r['distancia_km']:>5.2f} km    "
                  f"{r['coste_total']:>6.2f} EUR    {ahorro:>5.2f} EUR ({ahorro/coste_mas_caro*100:>4.1f}%)")
        
        # 6. Recomendación
        mejor = resultados[0]
        print("\n" + "=" * 80)
        print(" RECOMENDACION")
        print("=" * 80)
        print(f"\nMEJOR OPCION: {mejor['supermercado']}")
        print(f"  - Distancia: {mejor['distancia_km']} km")
        print(f"  - Coste total: {mejor['coste_total']} EUR")
        print(f"  - Ahorro vs mas caro: {coste_mas_caro - mejor['coste_total']:.2f} EUR "
              f"({(coste_mas_caro - mejor['coste_total'])/coste_mas_caro*100:.1f}%)")
        
        # 7. Desglose
        print(f"\nDESGLOSE DE PRECIOS - {mejor['supermercado']}")
        print("-" * 50)
        for producto, precio in mejor['productos'].items():
            print(f"  {producto:<35} {precio:>6.2f} EUR")
        print("-" * 50)
        print(f"  TOTAL{' '*29} {mejor['coste_total']:>6.2f} EUR")
        
        return resultados

def main():
    """Función principal interactiva."""
    print("=" * 80)
    print(" SMART SHOPPING - ANALISIS DE PRECIOS INTERACTIVO")
    print(" Busca los mejores precios cerca de CUALQUIER direccion")
    print("=" * 80)
    
    # Crear analizador
    analizador = AnalizadorPrecios()
    
    # Modo interactivo
    while True:
        print("\n" + "=" * 80)
        direccion = input("\nIntroduce una direccion (o 'salir' para terminar): ").strip()
        
        if direccion.lower() in ['salir', 'exit', 'quit', 'q']:
            print("\nGracias por usar Smart Shopping!")
            break
        
        if not direccion:
            print("[ERROR] Debes introducir una direccion")
            continue
        
        # Analizar
        analizador.analizar_direccion(direccion, radio_km=50)
        
        # Preguntar si quiere continuar
        continuar = input("\nQuieres analizar otra direccion? (s/n): ").strip().lower()
        if continuar not in ['s', 'si', 'y', 'yes']:
            print("\nGracias por usar Smart Shopping!")
            break

if __name__ == "__main__":
    main()
