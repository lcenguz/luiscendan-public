"""
ETL Layer 3: DRV/EXP (Derived / Exploitation)
Calcula KPIs, métricas y genera datos para análisis.
"""

import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import numpy as np

class ETL_Layer3_DRV:
    """
    Capa 3: DRV/EXP
    - Calcula KPIs y métricas
    - Genera datos agregados
    - Prepara datos para visualización
    - Almacena en MongoDB colección 'drv_kpis'
    """
    
    def __init__(self, mongo_uri="mongodb://root:example@localhost:27017/"):
        """Inicializa conexión a MongoDB."""
        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client['shopping_db']
            self.ods_collection = self.db['ods_prices']
            self.drv_collection = self.db['drv_kpis']
            print("[OK] Conexion a MongoDB establecida")
        except Exception as e:
            print(f"[ERROR] No se pudo conectar a MongoDB: {e}")
            raise
    
    def calculate_basket_cost(self):
        """
        KPI 1: Coste total de la cesta por supermercado y fecha.
        
        Returns:
            DataFrame con costes de cesta
        """
        print("\n[KPI 1] Calculando coste total de cesta...")
        
        # Leer datos de ODS
        data = list(self.ods_collection.find())
        df = pd.DataFrame(data)
        
        if df.empty:
            print("[WARNING] No hay datos en ODS")
            return pd.DataFrame()
        
        # Agrupar por fecha y supermercado
        basket_cost = df.groupby(['Date', 'Supermarket'])['Price'].sum().reset_index()
        basket_cost.rename(columns={'Price': 'TotalCost'}, inplace=True)
        basket_cost['KPI'] = 'basket_cost'
        
        print(f"[OK] {len(basket_cost)} registros de coste de cesta calculados")
        return basket_cost
    
    def calculate_average_price_per_product(self):
        """
        KPI 2: Precio promedio por producto y supermercado.
        
        Returns:
            DataFrame con precios promedio
        """
        print("\n[KPI 2] Calculando precio promedio por producto...")
        
        data = list(self.ods_collection.find())
        df = pd.DataFrame(data)
        
        if df.empty:
            return pd.DataFrame()
        
        # Agrupar por producto y supermercado
        avg_price = df.groupby(['Product', 'Supermarket'])['Price'].mean().reset_index()
        avg_price.rename(columns={'Price': 'AveragePrice'}, inplace=True)
        avg_price['KPI'] = 'average_price'
        
        print(f"[OK] {len(avg_price)} registros de precio promedio calculados")
        return avg_price
    
    def calculate_price_variation(self):
        """
        KPI 3: Variación de precios (min, max, std) por producto.
        
        Returns:
            DataFrame con variaciones de precio
        """
        print("\n[KPI 3] Calculando variacion de precios...")
        
        data = list(self.ods_collection.find())
        df = pd.DataFrame(data)
        
        if df.empty:
            return pd.DataFrame()
        
        # Calcular estadísticas por producto
        price_stats = df.groupby('Product')['Price'].agg([
            ('MinPrice', 'min'),
            ('MaxPrice', 'max'),
            ('AvgPrice', 'mean'),
            ('StdPrice', 'std'),
            ('PriceRange', lambda x: x.max() - x.min())
        ]).reset_index()
        
        price_stats['KPI'] = 'price_variation'
        
        print(f"[OK] {len(price_stats)} registros de variacion calculados")
        return price_stats
    
    def calculate_cheapest_supermarket_per_product(self):
        """
        KPI 4: Supermercado más barato por producto.
        
        Returns:
            DataFrame con supermercados más baratos
        """
        print("\n[KPI 4] Identificando supermercado mas barato por producto...")
        
        data = list(self.ods_collection.find())
        df = pd.DataFrame(data)
        
        if df.empty:
            return pd.DataFrame()
        
        # Encontrar precio mínimo por producto
        cheapest = df.loc[df.groupby('Product')['Price'].idxmin()]
        cheapest = cheapest[['Product', 'Supermarket', 'Price']].copy()
        cheapest.rename(columns={'Price': 'BestPrice', 'Supermarket': 'BestSupermarket'}, inplace=True)
        cheapest['KPI'] = 'cheapest_supermarket'
        
        print(f"[OK] {len(cheapest)} productos analizados")
        return cheapest
    
    def calculate_historical_trend(self):
        """
        KPI 5: Tendencia histórica de precios por producto.
        
        Returns:
            DataFrame con tendencias
        """
        print("\n[KPI 5] Calculando tendencias historicas...")
        
        data = list(self.ods_collection.find())
        df = pd.DataFrame(data)
        
        if df.empty:
            return pd.DataFrame()
        
        # Convertir fecha a datetime
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Ordenar por fecha
        df = df.sort_values('Date')
        
        # Calcular tendencia por producto
        trends = []
        for product in df['Product'].unique():
            product_data = df[df['Product'] == product]
            
            if len(product_data) > 1:
                # Calcular tendencia (precio final - precio inicial)
                first_price = product_data.iloc[0]['Price']
                last_price = product_data.iloc[-1]['Price']
                trend = ((last_price - first_price) / first_price) * 100
                
                trends.append({
                    'Product': product,
                    'FirstPrice': first_price,
                    'LastPrice': last_price,
                    'TrendPercent': round(trend, 2),
                    'TrendDirection': 'UP' if trend > 0 else 'DOWN' if trend < 0 else 'STABLE',
                    'KPI': 'historical_trend'
                })
        
        trend_df = pd.DataFrame(trends)
        print(f"[OK] {len(trend_df)} tendencias calculadas")
        return trend_df
    
    def calculate_volatility_index(self):
        """
        KPI 6: Índice de volatilidad por producto.
        
        Returns:
            DataFrame con índices de volatilidad
        """
        print("\n[KPI 6] Calculando indice de volatilidad...")
        
        data = list(self.ods_collection.find())
        df = pd.DataFrame(data)
        
        if df.empty:
            return pd.DataFrame()
        
        # Calcular coeficiente de variación (CV) por producto
        volatility = df.groupby('Product')['Price'].agg([
            ('Mean', 'mean'),
            ('Std', 'std')
        ]).reset_index()
        
        # CV = (Std / Mean) * 100
        volatility['VolatilityIndex'] = (volatility['Std'] / volatility['Mean']) * 100
        volatility['VolatilityLevel'] = volatility['VolatilityIndex'].apply(
            lambda x: 'HIGH' if x > 20 else 'MEDIUM' if x > 10 else 'LOW'
        )
        volatility['KPI'] = 'volatility_index'
        
        print(f"[OK] {len(volatility)} indices calculados")
        return volatility
    
    def calculate_best_shopping_option(self):
        """
        KPI 7: Mejor opción de compra (supermercado con cesta más barata).
        
        Returns:
            DataFrame con mejores opciones
        """
        print("\n[KPI 7] Identificando mejor opcion de compra...")
        
        # Usar datos de basket_cost
        basket_cost = self.calculate_basket_cost()
        
        if basket_cost.empty:
            return pd.DataFrame()
        
        # Encontrar supermercado más barato por fecha
        best_option = basket_cost.loc[basket_cost.groupby('Date')['TotalCost'].idxmin()]
        best_option['KPI'] = 'best_shopping_option'
        
        print(f"[OK] {len(best_option)} mejores opciones identificadas")
        return best_option
    
    def calculate_savings_potential(self):
        """
        KPI 8: Ahorro potencial (diferencia entre supermercado más caro y más barato).
        
        Returns:
            DataFrame con ahorros potenciales
        """
        print("\n[KPI 8] Calculando ahorro potencial...")
        
        basket_cost = self.calculate_basket_cost()
        
        if basket_cost.empty:
            return pd.DataFrame()
        
        # Calcular ahorro por fecha
        savings = basket_cost.groupby('Date')['TotalCost'].agg([
            ('MinCost', 'min'),
            ('MaxCost', 'max')
        ]).reset_index()
        
        savings['SavingsPotential'] = savings['MaxCost'] - savings['MinCost']
        savings['SavingsPercent'] = (savings['SavingsPotential'] / savings['MaxCost']) * 100
        savings['KPI'] = 'savings_potential'
        
        print(f"[OK] {len(savings)} registros de ahorro calculados")
        return savings
    
    def run_etl_layer3(self):
        """Ejecuta el ETL completo de la Capa 3."""
        print("=" * 70)
        print(" ETL LAYER 3: DRV/EXP")
        print("=" * 70)
        
        # Limpiar colección DRV
        self.drv_collection.delete_many({})
        
        total_kpis = 0
        
        # Calcular todos los KPIs
        kpis = [
            self.calculate_basket_cost(),
            self.calculate_average_price_per_product(),
            self.calculate_price_variation(),
            self.calculate_cheapest_supermarket_per_product(),
            self.calculate_historical_trend(),
            self.calculate_volatility_index(),
            self.calculate_best_shopping_option(),
            self.calculate_savings_potential()
        ]
        
        # Guardar KPIs en MongoDB
        for kpi_df in kpis:
            if not kpi_df.empty:
                # Añadir metadatos
                kpi_df['_calculated_at'] = datetime.now()
                kpi_df['_layer'] = 'DRV'
                
                # Convertir a diccionarios
                records = kpi_df.to_dict('records')
                
                if records:
                    result = self.drv_collection.insert_many(records)
                    total_kpis += len(result.inserted_ids)
        
        print(f"\n[RESUMEN] {total_kpis} KPIs calculados y guardados")
        print("[OK] ETL Layer 3 completado")
        
        # Mostrar resumen de KPIs
        self.show_kpi_summary()
        
        return total_kpis
    
    def show_kpi_summary(self):
        """Muestra resumen de KPIs calculados."""
        print("\n" + "=" * 70)
        print(" RESUMEN DE KPIs CALCULADOS")
        print("=" * 70)
        
        # Contar por tipo de KPI
        pipeline = [
            {"$group": {"_id": "$KPI", "count": {"$sum": 1}}}
        ]
        kpi_counts = list(self.drv_collection.aggregate(pipeline))
        
        for item in sorted(kpi_counts, key=lambda x: x['_id']):
            print(f"   {item['_id']:30} {item['count']:6} registros")

def main():
    """Ejecuta el ETL de la Capa 3."""
    try:
        etl = ETL_Layer3_DRV()
        etl.run_etl_layer3()
        
    except Exception as e:
        print(f"\n[ERROR] ETL Layer 3 fallo: {e}")
        print("\n[SOLUCION]")
        print("1. Verifica que MongoDB este corriendo")
        print("2. Ejecuta primero: python src\\etl_layer2_ods.py")

if __name__ == "__main__":
    main()
