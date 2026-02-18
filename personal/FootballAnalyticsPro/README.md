# ⚽ Football Analytics Pro

## 🎯 Descripción
Plataforma profesional de análisis y predicción de estadísticas de fútbol con datos en tiempo real de todas las ligas principales del mundo (2024-presente).

## 🏗️ Arquitectura

### Frontend (Angular 17+)
- **Framework**: Angular 17 con Standalone Components
- **UI**: Angular Material + Custom Design System
- **Charts**: Chart.js / ApexCharts para visualizaciones
- **Real-time**: WebSocket client para actualizaciones en vivo
- **State Management**: NgRx (opcional) o Signals

### Backend (Spring Boot 3.x)
- **Framework**: Spring Boot 3.2+
- **Database**: PostgreSQL 15+
- **Cache**: Redis para optimización
- **WebSockets**: STOMP para comunicación en tiempo real
- **API Integration**: API-Football (https://www.api-football.com/)
- **Security**: Spring Security + JWT

### Predicciones (Python Microservicio)
- **Framework**: FastAPI
- **ML Libraries**: scikit-learn, pandas, numpy
- **Models**: Regresión, Random Forest, XGBoost

## 📊 Funcionalidades

### 1. Dashboard Principal
- Vista general de ligas activas
- Partidos en vivo con actualizaciones en tiempo real
- Estadísticas destacadas del día

### 2. Análisis de Equipos
- Estadísticas completas: goles, victorias, derrotas, empates
- Métricas avanzadas: posesión, córners, tarjetas, tiros
- Comparativas entre equipos
- Tendencias y racha actual

### 3. Análisis de Ligas
- Clasificación en tiempo real
- Estadísticas agregadas por liga
- Comparativas entre temporadas

### 4. Predicciones
- Predicción de resultados basada en datos históricos
- Probabilidades de victoria/empate/derrota
- Predicción de goles esperados (xG)
- Análisis de tendencias

### 5. Visualizaciones
- Gráficos interactivos de rendimiento
- Mapas de calor de posesión
- Timeline de eventos del partido
- Comparativas visuales

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Java 17+
- PostgreSQL 15+
- Redis (opcional pero recomendado)
- Python 3.10+ (para microservicio de predicciones)

### 1. Configurar Backend

```bash
cd backend
./mvnw clean install
```

Configurar `application.properties`:
```properties
# API-Football
api.football.key=YOUR_API_KEY
api.football.url=https://v3.football.api-sports.io

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/football_analytics
spring.datasource.username=your_username
spring.datasource.password=your_password

# Redis
spring.redis.host=localhost
spring.redis.port=6379
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
```

Configurar `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  wsUrl: 'ws://localhost:8080/ws'
};
```

### 3. Configurar Microservicio de Predicciones

```bash
cd prediction-service
pip install -r requirements.txt
```

### 4. Ejecutar la Aplicación

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
ng serve
```

**Prediction Service:**
```bash
cd prediction-service
uvicorn main:app --reload
```

Acceder a: `http://localhost:4200`

## 📁 Estructura del Proyecto

```
FootballAnalyticsPro/
├── frontend/                 # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # Services, Guards, Interceptors
│   │   │   ├── shared/      # Shared Components, Pipes, Directives
│   │   │   ├── features/    # Feature Modules
│   │   │   │   ├── dashboard/
│   │   │   │   ├── teams/
│   │   │   │   ├── leagues/
│   │   │   │   ├── matches/
│   │   │   │   └── predictions/
│   │   │   └── layout/      # Layout Components
│   │   └── assets/
│   └── package.json
│
├── backend/                  # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/footballanalytics/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   └── websocket/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── prediction-service/       # Python ML Service
│   ├── models/
│   ├── services/
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

## 🎨 Características de Diseño

- **Dark Mode Premium**: Tema oscuro profesional por defecto
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Animaciones Fluidas**: Transiciones suaves y micro-interacciones
- **Glassmorphism**: Efectos modernos de vidrio esmerilado
- **Real-time Updates**: Indicadores visuales de datos en vivo
- **Data Visualization**: Gráficos interactivos y dashboards dinámicos

## 🔑 API-Football

Este proyecto utiliza [API-Football](https://www.api-football.com/) para obtener datos en tiempo real.

**Planes disponibles:**
- Free: 100 requests/día (ideal para desarrollo)
- Paid: Desde $10/mes con más requests

**Endpoints principales:**
- `/fixtures/live` - Partidos en vivo
- `/teams/statistics` - Estadísticas de equipos
- `/leagues` - Información de ligas
- `/standings` - Clasificaciones

## 📈 Roadmap

- [x] Configuración inicial del proyecto
- [ ] Backend: Entidades y repositorios
- [ ] Backend: Integración con API-Football
- [ ] Backend: WebSocket para tiempo real
- [ ] Frontend: Estructura y routing
- [ ] Frontend: Dashboard principal
- [ ] Frontend: Módulo de equipos
- [ ] Frontend: Módulo de ligas
- [ ] Frontend: Visualizaciones avanzadas
- [ ] Microservicio de predicciones
- [ ] Integración ML con backend
- [ ] Testing y optimización
- [ ] Deployment

## 📝 Licencia

MIT License - Luis Cendán © 2026

## 🤝 Contribuciones

Este es un proyecto personal de aprendizaje y análisis.

---

**Desarrollado con ❤️ por Luis Cendán**
