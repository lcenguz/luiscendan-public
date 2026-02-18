# ⚡ Comandos Rápidos - Football Analytics Pro

## 🚀 Inicio Rápido

### Iniciar Todo (Automático)
```powershell
.\start-app.ps1
```

### Iniciar Backend Solo
```powershell
cd backend
.\mvnw spring-boot:run
```

### Iniciar Frontend Solo
```powershell
cd frontend
ng serve --open
```

## 🔧 Configuración Inicial

### 1. Crear Base de Datos
```sql
CREATE DATABASE football_analytics;
```

### 2. Configurar Backend
Editar `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=TU_PASSWORD
api.football.key=TU_API_KEY
```

### 3. Instalar Dependencias Frontend
```powershell
cd frontend
npm install
```

## 📊 Endpoints Útiles

### Ligas
```bash
# Todas las ligas de 2024
curl http://localhost:8080/api/leagues/season/2024

# Clasificación de La Liga
curl http://localhost:8080/api/leagues/140/standings/season/2024
```

### Partidos
```bash
# Partidos en vivo
curl http://localhost:8080/api/matches/live

# Partidos de hoy (formato: YYYY-MM-DD)
curl http://localhost:8080/api/matches/date/2026-01-03

# Partidos de la Premier League
curl http://localhost:8080/api/matches/league/39/season/2024

# Estadísticas de un partido
curl http://localhost:8080/api/matches/12345/statistics
```

### Equipos
```bash
# Información de un equipo
curl http://localhost:8080/api/teams/33

# Equipos de la Champions League
curl http://localhost:8080/api/teams/league/2/season/2024

# Estadísticas de un equipo
curl "http://localhost:8080/api/teams/33/statistics?leagueId=39&season=2024"
```

## 🔄 Comandos de Desarrollo

### Backend

```powershell
# Compilar
cd backend
.\mvnw clean install

# Ejecutar tests
.\mvnw test

# Limpiar y compilar
.\mvnw clean package

# Ejecutar con perfil específico
.\mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend

```powershell
cd frontend

# Servir en modo desarrollo
ng serve

# Servir y abrir navegador
ng serve --open

# Servir en puerto específico
ng serve --port 4300

# Build para producción
ng build --configuration production

# Ejecutar tests
ng test

# Ejecutar tests E2E
ng e2e

# Generar componente
ng generate component features/dashboard

# Generar servicio
ng generate service core/services/analytics

# Generar módulo
ng generate module features/predictions --routing
```

## 🗄️ Base de Datos

### PostgreSQL

```powershell
# Conectar a PostgreSQL
psql -U postgres

# Conectar a la base de datos
\c football_analytics

# Listar tablas
\dt

# Ver estructura de tabla
\d leagues

# Consultar datos
SELECT * FROM leagues LIMIT 10;
SELECT * FROM matches WHERE status = 'LIVE';
SELECT * FROM teams WHERE country = 'Spain';
```

### Redis

```powershell
# Iniciar Redis
redis-server

# Conectar a Redis CLI
redis-cli

# Ver todas las claves
KEYS *

# Ver valor de una clave
GET "leagues::2024"

# Ver TTL de una clave
TTL "fixtures::2026-01-03"

# Limpiar caché
FLUSHALL
```

## 🐛 Debugging

### Ver Logs del Backend
```powershell
# En tiempo real
tail -f backend/logs/spring-boot-logger.log

# Últimas 100 líneas
Get-Content backend/logs/spring-boot-logger.log -Tail 100
```

### Ver Logs del Frontend
Abre la consola del navegador (F12) y ve a la pestaña "Console"

### Verificar Conexión WebSocket
```javascript
// En la consola del navegador
console.log('WebSocket connected:', websocketService.isConnected());
```

## 📦 IDs de Ligas Principales

```bash
# Premier League (Inglaterra)
leagueId=39

# La Liga (España)
leagueId=140

# Serie A (Italia)
leagueId=135

# Bundesliga (Alemania)
leagueId=78

# Ligue 1 (Francia)
leagueId=61

# Champions League
leagueId=2

# Europa League
leagueId=3
```

## 🧪 Testing Rápido

### Test Backend con curl

```bash
# Health check
curl http://localhost:8080/actuator/health

# Partidos en vivo
curl http://localhost:8080/api/matches/live | jq

# Clasificación Premier League
curl http://localhost:8080/api/leagues/39/standings/season/2024 | jq
```

### Test Frontend

```powershell
# Abrir en navegador
start http://localhost:4200

# Verificar build
ng build --configuration production
```

## 🔐 Seguridad

### Cambiar JWT Secret
Editar `application.properties`:
```properties
jwt.secret=tu-nuevo-secret-muy-largo-y-seguro
```

### Cambiar Password de DB
```sql
ALTER USER postgres WITH PASSWORD 'nuevo_password';
```

## 📊 Monitoreo

### Spring Boot Actuator
```bash
# Health
curl http://localhost:8080/actuator/health

# Info
curl http://localhost:8080/actuator/info

# Metrics
curl http://localhost:8080/actuator/metrics
```

## 🚀 Deployment (Futuro)

### Build Backend
```powershell
cd backend
.\mvnw clean package
# JAR generado en: target/football-analytics-pro-1.0.0.jar
```

### Build Frontend
```powershell
cd frontend
ng build --configuration production
# Archivos generados en: dist/
```

### Ejecutar JAR
```powershell
java -jar backend/target/football-analytics-pro-1.0.0.jar
```

## 🔄 Git Commands

```bash
# Inicializar repositorio
git init

# Añadir archivos
git add .

# Commit
git commit -m "Initial commit: Football Analytics Pro"

# Añadir remote
git remote add origin https://github.com/tuusuario/football-analytics-pro.git

# Push
git push -u origin main
```

## 📝 Notas Importantes

1. **API Limit:** 100 requests/día en plan gratuito
2. **Cache:** Redis cachea por 1 hora las consultas frecuentes
3. **WebSocket:** Actualiza cada 30 segundos los partidos en vivo
4. **Logs:** Revisa los logs si algo no funciona

## 🆘 Solución Rápida de Problemas

### Backend no inicia
```powershell
# Verificar Java
java -version

# Verificar PostgreSQL
psql -U postgres -c "SELECT version();"

# Limpiar y recompilar
cd backend
.\mvnw clean install
```

### Frontend no inicia
```powershell
# Limpiar node_modules
cd frontend
Remove-Item -Recurse -Force node_modules
npm install

# Limpiar caché de Angular
ng cache clean
```

### Base de datos no conecta
```sql
-- Verificar que la DB existe
\l

-- Crear si no existe
CREATE DATABASE football_analytics;
```

---

**Tip:** Guarda este archivo en tus favoritos para acceso rápido a los comandos más útiles.

**Desarrollado por Luis Cendán © 2026**
