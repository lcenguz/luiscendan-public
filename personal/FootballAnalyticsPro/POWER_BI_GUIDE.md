# 📊 Guía Completa: Exportar Datos para Power BI

## 🎯 **¿Qué Puedes Hacer?**

Este proyecto ahora puede **extraer datos de fútbol y exportarlos a CSV** para que los uses en **Power BI**.

---

## 🚀 **PASO 1: Iniciar el Backend**

```powershell
cd backend
mvn spring-boot:run
```

Espera a ver: `Started FootballAnalyticsProApplication`

---

## 📥 **PASO 2: Exportar Datos a CSV**

### **Opción A: Exportar TODO de una vez**

Abre tu navegador y ve a:
```
http://localhost:8080/api/export/all
```

Esto creará **6 archivos CSV** en `D:\PowerBI_Data\`:
- ✅ `competitions_YYYYMMDD_HHMMSS.csv`
- ✅ `live_matches_YYYYMMDD_HHMMSS.csv`
- ✅ `today_matches_YYYYMMDD_HHMMSS.csv`
- ✅ `standings_140_2024_YYYYMMDD_HHMMSS.csv`
- ✅ `squad_486_YYYYMMDD_HHMMSS.csv`
- ✅ `team_stats_486_YYYYMMDD_HHMMSS.csv`

### **Opción B: Exportar Datos Específicos**

| Datos | URL | Archivo Generado |
|-------|-----|------------------|
| **Competiciones** | `http://localhost:8080/api/export/competitions` | `competitions_*.csv` |
| **Partidos en Vivo** | `http://localhost:8080/api/export/live` | `live_matches_*.csv` |
| **Partidos de Hoy** | `http://localhost:8080/api/export/today` | `today_matches_*.csv` |
| **Clasificación** | `http://localhost:8080/api/export/standings/140/2024` | `standings_*.csv` |
| **Plantilla** | `http://localhost:8080/api/export/squad/486` | `squad_*.csv` |
| **Estadísticas** | `http://localhost:8080/api/export/stats/486` | `team_stats_*.csv` |

---

## 📂 **PASO 3: Ubicación de los Archivos**

Todos los archivos CSV se guardan en:
```
D:\PowerBI_Data\
```

Puedes cambiar la ruta añadiendo `?path=TU_RUTA` a la URL:
```
http://localhost:8080/api/export/all?path=C:/MisDatos
```

---

## 📊 **PASO 4: Importar en Power BI**

### **1. Abrir Power BI Desktop**

### **2. Obtener Datos**
- Click en **"Obtener datos"**
- Selecciona **"Texto/CSV"**
- Navega a `D:\PowerBI_Data\`
- Selecciona el archivo que quieras

### **3. Transformar Datos (si es necesario)**
- Click en **"Transformar datos"**
- Ajusta tipos de datos
- Renombra columnas si quieres

### **4. Cargar Datos**
- Click en **"Cerrar y aplicar"**

### **5. Crear Visualizaciones**
¡Ahora puedes crear tus dashboards!

---

## 📋 **Estructura de los CSV**

### **competitions.csv**
```csv
ID,Name,Country,Code,Season,Type
140,La Liga,Spain,ES,2024,League
39,Premier League,England,GB,2024,League
```

### **live_matches.csv**
```csv
ID,HomeTeam,AwayTeam,HomeGoals,AwayGoals,Minute,Status,League
1001,Real Madrid,Barcelona,2,1,45+2,HALFTIME,La Liga
```

### **today_matches.csv**
```csv
ID,HomeTeam,AwayTeam,Time,Status,League
2001,Atletico Madrid,Sevilla,18:00,SCHEDULED,La Liga
```

### **standings.csv**
```csv
Position,Team,Played,Won,Drawn,Lost,GoalsFor,GoalsAgainst,GoalDifference,Points
1,Real Madrid,20,15,3,2,45,15,30,48
```

### **squad.csv**
```csv
Number,Name,Position,Age,Nationality
1,Thibaut Courtois,Goalkeeper,31,Belgium
7,Vinícius Júnior,Forward,23,Brazil
```

### **team_stats.csv**
```csv
Metric,Value
matchesPlayed,20
wins,15
goalsFor,45
avgPossession,58.5
```

---

## 🎨 **Ideas de Dashboards en Power BI**

### **Dashboard 1: Visión General de Ligas**
- 📊 Gráfico de barras: Equipos por país
- 🗺️ Mapa: Competiciones por continente
- 📈 KPI: Total de competiciones

### **Dashboard 2: Análisis de Partidos**
- ⚽ Tabla: Partidos en vivo
- 📅 Calendario: Partidos de hoy
- 🔥 Gráfico: Goles por equipo

### **Dashboard 3: Clasificaciones**
- 📊 Tabla: Clasificación de la liga
- 📈 Gráfico de líneas: Evolución de puntos
- 🎯 KPI: Diferencia de goles

### **Dashboard 4: Análisis de Equipos**
- 👥 Tabla: Plantilla del equipo
- 📊 Gráfico de barras: Jugadores por posición
- 🌍 Mapa: Nacionalidades

### **Dashboard 5: Estadísticas Avanzadas**
- 📈 Gráficos de medidores: Posesión, precisión
- 📊 Gráfico de barras: Goles, victorias
- 🎯 KPIs: Racha actual, partidos jugados

---

## 🔄 **Actualizar Datos**

Para obtener datos actualizados:

1. **Vuelve a llamar al endpoint:**
   ```
   http://localhost:8080/api/export/all
   ```

2. **En Power BI:**
   - Click en **"Actualizar"** en la cinta
   - O configura actualización automática

---

## 💡 **Consejos Pro**

### **1. Automatizar la Exportación**

Crea un script PowerShell:

```powershell
# export_data.ps1
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Write-Host "Exportando datos a las $timestamp..."

Invoke-WebRequest -Uri "http://localhost:8080/api/export/all" -OutFile "D:\PowerBI_Data\export_log_$timestamp.json"

Write-Host "✅ Datos exportados correctamente"
```

Ejecuta:
```powershell
.\export_data.ps1
```

### **2. Programar Exportación Automática**

Usa el **Programador de Tareas de Windows**:
1. Abre "Programador de tareas"
2. Crear tarea básica
3. Ejecutar: `powershell.exe -File "ruta\export_data.ps1"`
4. Programa: Diario a las 8:00 AM

### **3. Conectar Power BI Directamente a la API**

En Power BI:
1. **Obtener datos** → **Web**
2. URL: `http://localhost:8080/api/mock/competitions`
3. **Aceptar**
4. Power BI parseará el JSON automáticamente

---

## 📊 **Endpoints Disponibles para Power BI**

### **Datos Mock (Siempre Disponibles)**
```
http://localhost:8080/api/mock/competitions
http://localhost:8080/api/mock/live
http://localhost:8080/api/mock/today
http://localhost:8080/api/mock/standings/140/2024
http://localhost:8080/api/mock/team/486
http://localhost:8080/api/mock/squad/486
http://localhost:8080/api/mock/stats/486
```

### **Exportar a CSV**
```
http://localhost:8080/api/export/all
http://localhost:8080/api/export/competitions
http://localhost:8080/api/export/live
http://localhost:8080/api/export/today
http://localhost:8080/api/export/standings/140/2024
http://localhost:8080/api/export/squad/486
http://localhost:8080/api/export/stats/486
```

---

## 🆘 **Solución de Problemas**

### **Error: "No se puede crear el archivo"**
- Verifica que existe `D:\PowerBI_Data\`
- Crea la carpeta manualmente si no existe

### **Error: "Backend no responde"**
- Asegúrate de que el backend esté corriendo
- Verifica: `http://localhost:8080/api/mock/competitions`

### **Los datos no se actualizan en Power BI**
- Click derecho en la tabla → Actualizar
- O configura actualización automática en opciones

---

## 🎯 **Resumen Rápido**

1. ✅ **Inicia el backend:** `mvn spring-boot:run`
2. ✅ **Exporta datos:** `http://localhost:8080/api/export/all`
3. ✅ **Abre Power BI:** Importa CSV desde `D:\PowerBI_Data\`
4. ✅ **Crea dashboards:** ¡A visualizar!

---

## 📞 **IDs Útiles**

| Liga | ID | Año |
|------|----|----|
| La Liga | 140 | 2024 |
| Premier League | 39 | 2024 |
| Serie A | 135 | 2024 |
| Bundesliga | 78 | 2024 |
| Ligue 1 | 61 | 2024 |

| Equipo | ID |
|--------|-----|
| Real Madrid | 486 |
| Barcelona | 529 |
| Manchester City | 50 |

---

**¡Ahora puedes crear dashboards profesionales en Power BI!** 📊🚀

**Desarrollado por Luis Cendán © 2026**
