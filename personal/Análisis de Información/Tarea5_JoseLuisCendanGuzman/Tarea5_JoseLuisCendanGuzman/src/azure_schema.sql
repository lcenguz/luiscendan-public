-- =============================================
-- SMART SHOPPING - SNOWFLAKE SCHEMA
-- =============================================

-- 1. DIMENSIÓN CATEGORIA
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dim_Categoria]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Dim_Categoria](
        [ID_Categoria] [int] NOT NULL,
        [Nombre] [nvarchar](100) NOT NULL,
        [Pasillo] [nvarchar](100) NULL,
        CONSTRAINT [PK_Dim_Categoria] PRIMARY KEY CLUSTERED ([ID_Categoria] ASC)
    );
END
GO

-- 2. DIMENSIÓN MARCA
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dim_Marca]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Dim_Marca](
        [ID_Marca] [int] NOT NULL,
        [Nombre] [nvarchar](100) NOT NULL,
        [Es_Marca_Blanca] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK_Dim_Marca] PRIMARY KEY CLUSTERED ([ID_Marca] ASC)
    );
END
GO

-- 3. DIMENSIÓN PROMOCION
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dim_Promocion]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Dim_Promocion](
        [ID_Promocion] [int] NOT NULL,
        [Descripcion] [nvarchar](100) NOT NULL,
        [Descuento_Aplicable] [decimal](5, 2) NOT NULL DEFAULT 0.00,
        CONSTRAINT [PK_Dim_Promocion] PRIMARY KEY CLUSTERED ([ID_Promocion] ASC)
    );
END
GO

-- 4. DIMENSIÓN PRODUCTO (Extendida)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dim_Producto]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Dim_Producto](
        [ID_Producto] [int] NOT NULL,
        [ID_Categoria] [int] NOT NULL,
        [ID_Marca] [int] NOT NULL,
        [Nombre] [nvarchar](150) NOT NULL,
        [Formato] [nvarchar](50) NULL,
        [NutriScore] [nvarchar](5) NULL,
        [Es_Sin_Gluten] [bit] DEFAULT 0,
        [Es_Bio] [bit] DEFAULT 0,
        CONSTRAINT [PK_Dim_Producto] PRIMARY KEY CLUSTERED ([ID_Producto] ASC),
        CONSTRAINT [FK_Producto_Categoria] FOREIGN KEY([ID_Categoria]) REFERENCES [dbo].[Dim_Categoria] ([ID_Categoria]),
        CONSTRAINT [FK_Producto_Marca] FOREIGN KEY([ID_Marca]) REFERENCES [dbo].[Dim_Marca] ([ID_Marca])
    );
END
GO

-- 5. DIMENSIÓN SUPERMERCADO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dim_Supermercado]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Dim_Supermercado](
        [ID_Supermercado] [int] NOT NULL,
        [Nombre] [nvarchar](100) NOT NULL,
        [Latitud] [decimal](9, 6) NOT NULL,
        [Longitud] [decimal](9, 6) NOT NULL,
        [Tipo] [nvarchar](50) NULL, -- Super/Hiper
        [Horario] [nvarchar](100) NULL,
        CONSTRAINT [PK_Dim_Supermercado] PRIMARY KEY CLUSTERED ([ID_Supermercado] ASC)
    );
END
GO

-- 6. FACT PRECIOS (Incluye Promociones)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Fact_Precios]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Fact_Precios](
        [ID_Precio] [int] IDENTITY(1,1) NOT NULL,
        [ID_Producto] [int] NOT NULL,
        [ID_Supermercado] [int] NOT NULL,
        [ID_Promocion] [int] NOT NULL DEFAULT 1, -- 1=Estandar
        [Fecha] [date] NOT NULL,
        [Precio_Unitario] [decimal](10, 2) NOT NULL,
        [Precio_Final] [decimal](10, 2) NOT NULL, -- Tras descuento
        CONSTRAINT [PK_Fact_Precios] PRIMARY KEY CLUSTERED ([ID_Precio] ASC),
        CONSTRAINT [FK_Fact_Producto] FOREIGN KEY([ID_Producto]) REFERENCES [dbo].[Dim_Producto] ([ID_Producto]),
        CONSTRAINT [FK_Fact_Supermercado] FOREIGN KEY([ID_Supermercado]) REFERENCES [dbo].[Dim_Supermercado] ([ID_Supermercado]),
        CONSTRAINT [FK_Fact_Promocion] FOREIGN KEY([ID_Promocion]) REFERENCES [dbo].[Dim_Promocion] ([ID_Promocion])
    );
END
GO

-- 7. TABLA DE LOGS (Primero, para FK)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Log_Peticiones]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Log_Peticiones](
        [ID_Peticion] [int] IDENTITY(1,1) NOT NULL,
        [Peticion_Original] [nvarchar](MAX) NULL,
        [Calle] [nvarchar](255) NULL,
        [Numero] [nvarchar](50) NULL,
        [Ciudad] [nvarchar](100) NULL,
        [Pueblo] [nvarchar](100) NULL,
        [Codigo_Postal] [nvarchar](20) NULL,
        [Latitud] [decimal](9, 6) NULL,
        [Longitud] [decimal](9, 6) NULL,
        [Resultados_JSON] [nvarchar](MAX) NULL,
        [Fecha_Peticion] [datetime] DEFAULT GETDATE(),
        CONSTRAINT [PK_Log_Peticiones] PRIMARY KEY CLUSTERED ([ID_Peticion] ASC)
    );
END
GO

-- 8. TABLA DE KPIs ESTRATÉGICOS (Después de Log_Peticiones)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[KPI_Analisis]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[KPI_Analisis](
        [ID_Analisis] [int] IDENTITY(1,1) NOT NULL,
        [ID_Peticion] [int] NULL, -- FK a Log_Peticiones
        [Fecha_Analisis] [datetime] DEFAULT GETDATE(),
        
        -- Métricas Clave
        [Supermercado_Mas_Economico] [nvarchar](100) NULL,
        [Precio_Minimo] [decimal](10, 2) NULL,
        [Precio_Maximo] [decimal](10, 2) NULL,
        [Precio_Promedio] [decimal](10, 2) NULL,
        [Ahorro_Potencial] [decimal](10, 2) NULL, -- Diferencia entre max y min
        [Porcentaje_Ahorro] [decimal](5, 2) NULL,
        
        -- KPIs Estratégicos
        [Num_Supermercados_Analizados] [int] NULL,
        [Distancia_Promedio] [decimal](10, 2) NULL,
        [Supermercado_Mejor_Relacion_Precio_Distancia] [nvarchar](100) NULL,
        
        -- Patrones y Tendencias
        [Categoria_Mas_Cara] [nvarchar](100) NULL,
        [Categoria_Mas_Barata] [nvarchar](100) NULL,
        [Porcentaje_Marcas_Blancas] [decimal](5, 2) NULL,
        [Porcentaje_Productos_Promocion] [decimal](5, 2) NULL,
        
        -- Oportunidades Estratégicas
        [Productos_Sin_Gluten_Disponibles] [int] NULL,
        [Productos_Bio_Disponibles] [int] NULL,
        [Descuento_Total_Aplicado] [decimal](10, 2) NULL,
        
        -- Optimización Operativa
        [Tiempo_Respuesta_Ms] [int] NULL,
        [Productos_Encontrados] [int] NULL,
        [Productos_No_Disponibles] [int] NULL,
        [Tasa_Disponibilidad] [decimal](5, 2) NULL, -- % productos encontrados
        
        CONSTRAINT [PK_KPI_Analisis] PRIMARY KEY CLUSTERED ([ID_Analisis] ASC),
        CONSTRAINT [FK_KPI_Peticion] FOREIGN KEY([ID_Peticion]) REFERENCES [dbo].[Log_Peticiones] ([ID_Peticion])
    );
END
GO

-- 9. VISTA DE PRODUCTOS ENRIQUECIDA (Para la App)
CREATE OR ALTER VIEW [dbo].[View_Productos_Full] AS
SELECT 
    p.ID_Producto,
    p.Nombre AS Producto,
    m.Nombre AS Marca,
    m.Es_Marca_Blanca,
    c.Nombre AS Categoria,
    p.Formato,
    p.NutriScore,
    p.Es_Sin_Gluten,
    p.Es_Bio
FROM Dim_Producto p
JOIN Dim_Marca m ON p.ID_Marca = m.ID_Marca
JOIN Dim_Categoria c ON p.ID_Categoria = c.ID_Categoria;
GO
