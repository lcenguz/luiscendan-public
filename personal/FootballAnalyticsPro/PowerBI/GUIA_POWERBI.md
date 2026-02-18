# 📊 Guía: Proyecto Power BI - Football Analytics

## 🎉 **¡Ya tienes tu proyecto Power BI listo!**

### 📁 **Ubicación del Proyecto:**
```
D:\Github\luiscendan-private\luiscendan-private\personal\ProyectosFinales\FootballAnalyticsPro\PowerBI\
```

---

## 🚀 **PASO 1: Abrir el Proyecto**

### **Opción A: Abrir con Power BI Desktop (Recomendado)**

1. **Abre Power BI Desktop**
2. **File** → **Open** → **Browse**
3. Navega a:
   ```
   D:\Github\luiscendan-private\luiscendan-private\personal\ProyectosFinales\FootballAnalyticsPro\PowerBI\
   ```
4. Selecciona: **`FootballAnalytics.pbip`**
5. Click en **"Abrir"**

### **Opción B: Doble Click**

Simplemente haz doble click en:
```
FootballAnalytics.pbip
```

---

## 📊 **PASO 2: Cargar los Datos**

Cuando abras el proyecto, Power BI buscará los archivos CSV en:
```
D:\PowerBI_Data\
```

Si los archivos no existen:

1. **Asegúrate de que el backend esté corriendo:**
   ```powershell
   cd backend
   mvn spring-boot:run
   ```

2. **Exporta los datos:**
   Abre en tu navegador:
   ```
   http://localhost:8080/api/export/all
   ```

3. **Actualiza en Power BI:**
   - Click en **"Actualizar"** en la cinta superior

---

## 📈 **PASO 3: Explorar el Dashboard**

El proyecto incluye **3 páginas**:

### **📊 Página 1: Visión General**
- **KPIs:**
  - Total de Competiciones
  - Partidos en Vivo
  - Total de Goles Hoy
- **Tabla:** Partidos en vivo con resultados
- **Gráfico:** Competiciones por país

### **📈 Página 2: Clasificación**
- **Tabla completa** con:
  - Posición
  - Equipo
  - Partidos jugados
  - Victorias, empates, derrotas
  - Goles a favor/en contra
  - Diferencia de goles
  - Puntos

### **👥 Página 3: Plantilla**
- **KPIs:**
  - Total de Jugadores
  - Edad Promedio
- **Tabla:** Plantilla completa del equipo
- **Gráfico circular:** Jugadores por posición

---

## 🎨 **PASO 4: Personalizar el Dashboard**

### **Cambiar Colores:**
1. Click en una visualización
2. **Format** → **Data colors**
3. Selecciona tus colores favoritos

### **Añadir Nuevas Visualizaciones:**
1. **Visualizations** panel (lado derecho)
2. Arrastra un tipo de gráfico al canvas
3. Arrastra campos desde **Fields** panel

### **Cambiar el Tema:**
1. **View** → **Themes**
2. Selecciona un tema predefinido
3. O crea tu propio tema personalizado

---

## 🔄 **PASO 5: Actualizar Datos**

### **Manualmente:**
1. Click en **"Actualizar"** en la cinta
2. O presiona **F5**

### **Automáticamente:**
1. **File** → **Options and settings** → **Options**
2. **Data Load** → **Background data**
3. Configura intervalo de actualización

---

## 💾 **PASO 6: Guardar y Compartir**

### **Guardar como .pbix (Archivo único):**
1. **File** → **Save As**
2. Selecciona formato **.pbix**
3. Guarda donde quieras

### **Publicar en Power BI Service:**
1. **Home** → **Publish**
2. Selecciona tu workspace
3. ¡Listo para compartir online!

---

## 📋 **Estructura del Proyecto**

```
PowerBI/
├── FootballAnalytics.pbip                    # ⭐ Archivo principal
├── FootballAnalytics.SemanticModel/
│   ├── definition.pbism                      # Definición del modelo
│   └── model.bim                             # Modelo de datos
└── FootballAnalytics.Report/
    └── definition.pbir                       # Definición del reporte
```

---

## 🎯 **Datos Incluidos**

### **Fuentes de Datos:**
1. **Competitions** - Competiciones disponibles
2. **LiveMatches** - Partidos en vivo
3. **TodayMatches** - Partidos programados hoy
4. **Standings** - Clasificación de la liga
5. **Squad** - Plantilla del equipo
6. **TeamStats** - Estadísticas del equipo

### **Medidas Calculadas:**
- `Total Competitions` - Cuenta total de competiciones
- `Total Live Matches` - Partidos en vivo
- `Total Goals Today` - Suma de goles
- `Avg Goals Per Match` - Promedio de goles
- `Total Players` - Total de jugadores
- `Avg Player Age` - Edad promedio

---

## 💡 **Ideas para Mejorar el Dashboard**

### **1. Añadir Filtros:**
- Por liga
- Por país
- Por fecha
- Por equipo

### **2. Más Visualizaciones:**
- **Mapa:** Competiciones por ubicación geográfica
- **Gráfico de líneas:** Evolución de puntos
- **Gráfico de barras:** Top goleadores
- **Gauge:** Porcentaje de victorias

### **3. Interactividad:**
- **Drill-through:** Click en un equipo para ver detalles
- **Tooltips:** Información adicional al pasar el mouse
- **Bookmarks:** Guardar vistas específicas

### **4. Análisis Avanzado:**
- **Tendencias:** Racha de victorias/derrotas
- **Comparaciones:** Equipo vs equipo
- **Predicciones:** Usando Quick Insights

---

## 🆘 **Solución de Problemas**

### **Error: "No se pueden cargar los datos"**
- Verifica que existen los archivos CSV en `D:\PowerBI_Data\`
- Exporta los datos desde: `http://localhost:8080/api/export/all`

### **Error: "Ruta no encontrada"**
- Edita las rutas en **Transform data** → **Data source settings**
- Cambia `D:\PowerBI_Data\` por tu ruta

### **Las visualizaciones están vacías**
- Click en **"Actualizar"**
- Verifica que los CSV tienen datos

### **El proyecto no abre**
- Asegúrate de tener **Power BI Desktop** instalado
- Descarga desde: https://powerbi.microsoft.com/desktop/

---

## 📊 **Ejemplo de Uso**

### **Caso 1: Análisis de Liga**
1. Ve a la página **"Clasificación"**
2. Ordena por **Puntos** (descendente)
3. Identifica al líder
4. Analiza diferencia de goles

### **Caso 2: Análisis de Equipo**
1. Ve a la página **"Plantilla"**
2. Filtra por **Posición** (ej: Forward)
3. Analiza edad promedio
4. Identifica nacionalidades

### **Caso 3: Partidos en Vivo**
1. Ve a la página **"Visión General"**
2. Mira la tabla de partidos en vivo
3. Identifica partidos con más goles
4. Analiza tendencias

---

## 🎓 **Recursos Adicionales**

### **Tutoriales Power BI:**
- [Documentación oficial](https://docs.microsoft.com/power-bi/)
- [Power BI Community](https://community.powerbi.com/)
- [YouTube - Guy in a Cube](https://www.youtube.com/c/GuyinaCube)

### **Plantillas de Dashboards:**
- [Power BI Templates](https://powerbi.microsoft.com/en-us/template-gallery/)
- [Community Templates](https://community.powerbi.com/t5/Themes-Gallery/bd-p/ThemesGallery)

---

## ✅ **Checklist**

Antes de empezar, asegúrate de:

- [ ] ✅ Power BI Desktop instalado
- [ ] ✅ Backend corriendo (puerto 8080)
- [ ] ✅ Datos exportados en `D:\PowerBI_Data\`
- [ ] ✅ Proyecto `.pbip` descargado
- [ ] ✅ Archivos CSV actualizados

---

## 🎉 **¡Listo para Analizar!**

Ahora tienes:
- ✅ Proyecto Power BI completo
- ✅ 3 páginas de dashboard
- ✅ 6 fuentes de datos
- ✅ Múltiples visualizaciones
- ✅ Medidas calculadas

**¡A crear análisis increíbles!** 📊🚀

---

**Desarrollado por Luis Cendán © 2026**
