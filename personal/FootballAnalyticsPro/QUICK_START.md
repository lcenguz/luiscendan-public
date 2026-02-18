# ⚡ Football Analytics Pro - Guía de Inicio Rápido

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js 18+** y npm
- ✅ **Java 17+** (JDK)
- ✅ **PostgreSQL 15+**
- ✅ **Maven** (o usar el wrapper incluido)
- ✅ **Redis** (opcional pero recomendado)
- ✅ **API-Football Key** (obtener en https://www.api-football.com/)

## 🚀 Paso 1: Configurar la Base de Datos

### PostgreSQL

```sql
-- Crear base de datos
CREATE DATABASE football_analytics;

-- Crear usuario (opcional)
CREATE USER football_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE football_analytics TO football_user;
```

### Redis (Opcional)

Si tienes Redis instalado, simplemente inícialo:

```powershell
redis-server
```

Si no tienes Redis, puedes comentar las dependencias de Redis en el `pom.xml` y las configuraciones en `application.properties`.

## 🔧 Paso 2: Configurar el Backend

### 2.1 Obtener API Key de API-Football

1. Ve a https://www.api-football.com/
2. Regístrate y obtén tu API Key gratuita (100 requests/día)
3. Copia tu API Key

### 2.2 Configurar application.properties

Edita el archivo:
```
backend/src/main/resources/application.properties
```

Actualiza las siguientes líneas:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/football_analytics
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD_AQUI

# API-Football
api.football.key=TU_API_KEY_AQUI

# Redis (si no usas Redis, comenta estas líneas)
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

### 2.3 Compilar y Ejecutar el Backend

```powershell
cd backend

# Compilar el proyecto
./mvnw clean install

# Ejecutar la aplicación
./mvnw spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

### 2.4 Verificar el Backend

Abre tu navegador y ve a:
- http://localhost:8080/api/matches/live (debería devolver JSON)

## 🎨 Paso 3: Configurar el Frontend

### 3.1 Crear el Proyecto Angular

```powershell
cd ..
cd frontend

# Si aún no has creado el proyecto Angular, ejecuta:
npx -y @angular/cli@17 new . --routing --style=scss --standalone --skip-git

# Instalar dependencias
npm install @angular/material @angular/cdk @angular/animations
npm install @stomp/stompjs sockjs-client
npm install @types/sockjs-client --save-dev
npm install ng-apexcharts apexcharts
npm install date-fns
```

### 3.2 Configurar Angular Material

```powershell
ng add @angular/material
```

Selecciona:
- Theme: **Custom** o **Indigo/Pink**
- Typography: **Yes**
- Animations: **Yes**

### 3.3 Ejecutar el Frontend

```powershell
ng serve
```

El frontend estará disponible en: **http://localhost:4200**

## 🎯 Paso 4: Verificar la Conexión

### 4.1 Verificar Backend

En tu navegador, abre la consola de desarrollador (F12) y verifica:

1. **API REST funcionando:**
   ```
   http://localhost:8080/api/leagues/season/2024
   ```

2. **WebSocket conectado:**
   Deberías ver mensajes en la consola como:
   ```
   STOMP: connected to server
   WebSocket connected
   ```

### 4.2 Verificar Frontend

1. Abre http://localhost:4200
2. Abre la consola del navegador (F12)
3. Deberías ver:
   - "WebSocket connected"
   - Actualizaciones cada 30 segundos de partidos en vivo

## 📊 Paso 5: Probar las Funcionalidades

### Endpoints Disponibles

**Ligas:**
- GET `/api/leagues/season/2024` - Todas las ligas de 2024
- GET `/api/leagues/{leagueId}/standings/season/2024` - Clasificación

**Partidos:**
- GET `/api/matches/live` - Partidos en vivo
- GET `/api/matches/date/2024-01-03` - Partidos por fecha
- GET `/api/matches/league/{leagueId}/season/2024` - Partidos de una liga
- GET `/api/matches/{fixtureId}/statistics` - Estadísticas de un partido

**Equipos:**
- GET `/api/teams/{teamId}` - Información de un equipo
- GET `/api/teams/league/{leagueId}/season/2024` - Equipos de una liga
- GET `/api/teams/{teamId}/statistics?leagueId=X&season=2024` - Estadísticas de un equipo

### WebSocket Topics

El frontend puede suscribirse a:
- `/topic/live-matches` - Actualizaciones de partidos en vivo
- `/topic/match-stats/{fixtureId}` - Estadísticas de un partido específico
- `/topic/standings/{leagueId}` - Clasificación de una liga
- `/topic/notifications` - Notificaciones generales

## 🎨 Paso 6: Ligas Principales Disponibles

Aquí están los IDs de las ligas principales para probar:

| Liga | País | ID | Temporada |
|------|------|-------|-----------|
| Premier League | Inglaterra | 39 | 2024 |
| La Liga | España | 140 | 2024 |
| Serie A | Italia | 135 | 2024 |
| Bundesliga | Alemania | 78 | 2024 |
| Ligue 1 | Francia | 61 | 2024 |
| Champions League | Europa | 2 | 2024 |
| Europa League | Europa | 3 | 2024 |

### Ejemplos de Uso:

```
# Clasificación de La Liga
http://localhost:8080/api/leagues/140/standings/season/2024

# Partidos de la Premier League
http://localhost:8080/api/matches/league/39/season/2024

# Equipos de la Champions League
http://localhost:8080/api/teams/league/2/season/2024
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté ejecutándose
- Verifica las credenciales en `application.properties`
- Verifica que la base de datos `football_analytics` exista

### Error: "API-Football returns 401"
- Verifica que tu API Key sea correcta
- Verifica que no hayas excedido el límite de requests (100/día en plan gratuito)

### Error: "WebSocket connection failed"
- Verifica que el backend esté ejecutándose en el puerto 8080
- Verifica la configuración CORS en `CorsConfig.java`
- Verifica que el frontend esté en http://localhost:4200

### Error: "Redis connection refused"
- Si no usas Redis, comenta las líneas de Redis en `application.properties`
- O inicia Redis con `redis-server`

## 📈 Próximos Pasos

1. **Crear componentes del Dashboard**
2. **Implementar visualizaciones con ApexCharts**
3. **Añadir sistema de predicciones**
4. **Crear módulo de análisis avanzado**
5. **Implementar caché inteligente**
6. **Añadir tests unitarios e integración**

## 🔗 Recursos Útiles

- **API-Football Docs:** https://www.api-football.com/documentation-v3
- **Angular Material:** https://material.angular.io/
- **ApexCharts:** https://apexcharts.com/
- **STOMP.js:** https://stomp-js.github.io/stomp-websocket/

## 💡 Consejos

1. **Límite de API:** Con el plan gratuito tienes 100 requests/día. Usa el caché de Redis para optimizar.
2. **Datos en tiempo real:** Los partidos en vivo se actualizan cada 30 segundos automáticamente.
3. **Performance:** Las consultas frecuentes están cacheadas por 1 hora.
4. **Desarrollo:** Usa `ng serve --open` para abrir automáticamente el navegador.

---

¡Listo! 🎉 Ahora tienes **Football Analytics Pro** funcionando con datos en tiempo real.

**Desarrollado por Luis Cendán © 2026**
