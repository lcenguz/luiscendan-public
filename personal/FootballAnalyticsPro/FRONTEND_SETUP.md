# Football Analytics Pro - Frontend Setup

## Inicialización del Proyecto Angular

Para crear el proyecto Angular, ejecuta los siguientes comandos:

```powershell
# Navegar al directorio del proyecto
cd d:\Github\luiscendan-private\luiscendan-private\personal\ProyectosFinales\FootballAnalyticsPro

# Crear proyecto Angular con configuración standalone
npx -y @angular/cli@17 new frontend --routing --style=scss --standalone --skip-git

# Cuando pregunte, seleccionar:
# - Would you like to add Angular routing? Yes
# - Which stylesheet format would you like to use? SCSS

# Navegar al directorio frontend
cd frontend

# Instalar dependencias adicionales
npm install @angular/material @angular/cdk @angular/animations
npm install chart.js ng2-charts
npm install @stomp/stompjs sockjs-client
npm install @types/sockjs-client --save-dev
npm install rxjs
npm install date-fns

# Instalar ApexCharts (alternativa premium a Chart.js)
npm install apexcharts ng-apexcharts

# Ejecutar el proyecto
ng serve
```

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── websocket.service.ts
│   │   │   │   └── football-data.service.ts
│   │   │   ├── models/
│   │   │   │   ├── league.model.ts
│   │   │   │   ├── team.model.ts
│   │   │   │   ├── match.model.ts
│   │   │   │   └── statistics.model.ts
│   │   │   └── interceptors/
│   │   │       └── http.interceptor.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── live-indicator/
│   │   │   │   └── stat-card/
│   │   │   └── pipes/
│   │   │       └── date-format.pipe.ts
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── live-matches/
│   │   │   ├── leagues/
│   │   │   ├── teams/
│   │   │   ├── statistics/
│   │   │   └── predictions/
│   │   └── app.component.ts
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       ├── _variables.scss
│   │       ├── _mixins.scss
│   │       └── _themes.scss
│   └── styles.scss
└── package.json
```

## Características del Frontend

### 1. Design System Premium
- Dark mode por defecto con tema personalizado
- Glassmorphism effects
- Gradientes vibrantes
- Animaciones fluidas
- Responsive design

### 2. Componentes Principales
- **Dashboard**: Vista general con estadísticas destacadas
- **Live Matches**: Partidos en vivo con actualizaciones en tiempo real
- **Leagues**: Explorador de ligas y clasificaciones
- **Teams**: Análisis detallado de equipos
- **Statistics**: Visualizaciones avanzadas
- **Predictions**: Sistema de predicciones

### 3. Real-time Features
- WebSocket connection para actualizaciones en vivo
- Live match scores
- Real-time standings updates
- Instant notifications

### 4. Data Visualization
- ApexCharts para gráficos interactivos
- Tablas dinámicas con Material Table
- Heat maps de posesión
- Timeline de eventos
- Comparativas visuales

## Próximos Pasos

1. Ejecutar el comando de inicialización
2. Configurar Angular Material
3. Crear servicios core
4. Implementar componentes shared
5. Desarrollar features modules
6. Integrar WebSocket
7. Añadir visualizaciones
8. Testing y optimización
