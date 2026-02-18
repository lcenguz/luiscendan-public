# 🏗️ Arquitectura Técnica - Football Analytics Pro

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Angular 17)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │ Live Matches │  │  Statistics  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Leagues    │  │    Teams     │  │ Predictions  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Services Layer                              │   │
│  │  • FootballDataService  • WebSocketService              │   │
│  │  • PredictionService    • CacheService                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP / WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot 3.2)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  REST Controllers                        │   │
│  │  • LeagueController  • MatchController                  │   │
│  │  • TeamController    • PredictionController             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↕                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Service Layer                          │   │
│  │  • FootballApiService  • LiveDataService                │   │
│  │  • DataSyncService     • StatisticsService              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↕                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Repository Layer (JPA)                      │   │
│  │  • LeagueRepository    • TeamRepository                 │   │
│  │  • MatchRepository     • StatisticsRepository           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL   │  │    Redis     │  │ API-Football │          │
│  │  (Primary)   │  │   (Cache)    │  │  (External)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Stack Tecnológico Detallado

### Frontend
- **Framework:** Angular 17 (Standalone Components)
- **UI Library:** Angular Material 17
- **Charts:** ApexCharts / Chart.js
- **WebSocket:** STOMP.js + SockJS
- **State Management:** RxJS + Signals
- **HTTP Client:** Angular HttpClient
- **Styling:** SCSS + CSS Variables
- **Build Tool:** Angular CLI + esbuild

### Backend
- **Framework:** Spring Boot 3.2.1
- **Java Version:** 17
- **Database:** PostgreSQL 15+
- **Cache:** Redis
- **WebSocket:** Spring WebSocket + STOMP
- **HTTP Client:** WebFlux (WebClient)
- **Security:** Spring Security + JWT
- **Scheduling:** Spring Quartz
- **Build Tool:** Maven

### External APIs
- **API-Football:** v3 (https://www.api-football.com/)
- **Rate Limit:** 100 requests/day (Free tier)
- **Upgrade Options:** Paid plans available

## 📦 Modelo de Datos

### Entidades Principales

#### League
```java
- id: Long (PK)
- apiId: Integer (Unique)
- name: String
- country: String
- logo: String
- flag: String
- season: Integer
- type: String
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

#### Team
```java
- id: Long (PK)
- apiId: Integer (Unique)
- name: String
- code: String
- country: String
- founded: Integer
- national: Boolean
- logo: String
- league: League (FK)
- venue: String
- venueCapacity: Integer
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

#### Match
```java
- id: Long (PK)
- apiId: Integer (Unique)
- league: League (FK)
- season: Integer
- matchDate: LocalDateTime
- homeTeam: Team (FK)
- awayTeam: Team (FK)
- homeGoals: Integer
- awayGoals: Integer
- status: MatchStatus (Enum)
- referee: String
- venue: String
- round: Integer
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

#### MatchStatistics
```java
- id: Long (PK)
- match: Match (FK, One-to-One)
- homeShotsOnGoal: Integer
- awayShotsOnGoal: Integer
- homeBallPossession: Integer
- awayBallPossession: Integer
- homeCornerKicks: Integer
- awayCornerKicks: Integer
- homeYellowCards: Integer
- awayYellowCards: Integer
- homeRedCards: Integer
- awayRedCards: Integer
- ... (más estadísticas)
```

#### TeamStatistics
```java
- id: Long (PK)
- team: Team (FK)
- league: League (FK)
- season: Integer
- matchesPlayed: Integer
- wins: Integer
- draws: Integer
- losses: Integer
- goalsFor: Integer
- goalsAgainst: Integer
- points: Integer
- position: Integer
- form: String
- ... (más estadísticas)
```

## 🔄 Flujo de Datos

### 1. Datos en Tiempo Real (WebSocket)

```
API-Football → Backend (Scheduled Task) → WebSocket → Frontend
     ↓
  PostgreSQL (Persist)
     ↓
   Redis (Cache)
```

**Proceso:**
1. Cada 30 segundos, `LiveDataService` consulta API-Football
2. Los datos se persisten en PostgreSQL
3. Se cachean en Redis por 5 minutos
4. Se envían vía WebSocket a todos los clientes conectados
5. Frontend actualiza la UI automáticamente

### 2. Consultas Históricas (REST)

```
Frontend → Backend → Redis (Check) → PostgreSQL → API-Football
                           ↓
                      Return if cached
```

**Proceso:**
1. Frontend solicita datos vía HTTP
2. Backend verifica caché en Redis
3. Si existe en caché, retorna inmediatamente
4. Si no existe, consulta PostgreSQL
5. Si no existe en DB, consulta API-Football
6. Persiste en DB y cachea en Redis
7. Retorna al frontend

## 🎯 Características Clave

### 1. Sistema de Caché Multinivel

```
Level 1: Redis (In-Memory)
  ├─ Live Matches: 30 segundos
  ├─ Standings: 1 hora
  ├─ Team Stats: 1 hora
  └─ Match Stats: 5 minutos

Level 2: PostgreSQL (Persistent)
  └─ Todos los datos históricos
```

### 2. Actualizaciones en Tiempo Real

- **Live Matches:** Actualización cada 30 segundos
- **Match Statistics:** Actualización bajo demanda
- **Standings:** Actualización diaria a las 2 AM
- **Team Statistics:** Actualización diaria a las 3 AM

### 3. Optimización de API Calls

**Estrategias:**
- Caché agresivo para datos estáticos
- Batch requests cuando sea posible
- Priorización de datos en vivo
- Fallback a datos cacheados si se excede el límite

### 4. WebSocket Topics

```
/topic/live-matches          → Todos los partidos en vivo
/topic/match-stats/{id}      → Estadísticas de un partido
/topic/standings/{leagueId}  → Clasificación de una liga
/topic/notifications         → Notificaciones generales
```

## 🔐 Seguridad

### Backend
- CORS configurado para localhost:4200
- JWT para autenticación (futuro)
- API Key protegida en properties
- Validación de inputs
- Rate limiting

### Frontend
- Environment variables para URLs
- HTTP Interceptors para headers
- Error handling global
- XSS protection

## 📈 Escalabilidad

### Horizontal Scaling
- Backend stateless (puede escalar horizontalmente)
- Redis compartido entre instancias
- PostgreSQL con replicación

### Vertical Scaling
- Optimización de queries JPA
- Índices en columnas frecuentes
- Connection pooling

## 🧪 Testing Strategy

### Backend
- Unit Tests: JUnit 5
- Integration Tests: Spring Boot Test
- API Tests: MockMvc
- Coverage Target: 80%

### Frontend
- Unit Tests: Jasmine + Karma
- E2E Tests: Cypress
- Component Tests: Angular Testing Library
- Coverage Target: 70%

## 📊 Monitoring & Logging

### Backend
- Spring Boot Actuator
- Logback para logging
- Métricas de performance
- Health checks

### Frontend
- Console logging (desarrollo)
- Error tracking (producción)
- Performance monitoring
- User analytics

## 🚀 Deployment

### Development
```
Backend:  localhost:8080
Frontend: localhost:4200
Database: localhost:5432
Redis:    localhost:6379
```

### Production (Futuro)
```
Backend:  Cloud (AWS/Azure/GCP)
Frontend: Vercel/Netlify
Database: Managed PostgreSQL
Redis:    Managed Redis
```

## 📝 Próximas Mejoras

1. **Autenticación y Usuarios**
   - Login/Register
   - Perfiles de usuario
   - Favoritos personalizados

2. **Predicciones con ML**
   - Microservicio Python
   - Modelos de Machine Learning
   - Predicción de resultados

3. **Análisis Avanzado**
   - Heat maps
   - Player tracking
   - Advanced metrics (xG, xA)

4. **Notificaciones Push**
   - Web Push API
   - Email notifications
   - Telegram bot

5. **Mobile App**
   - React Native / Flutter
   - Compartir código con web

---

**Desarrollado por Luis Cendán © 2026**
