# 📚 Gestión Académica - StudyHub Pro

## Nuevas Funcionalidades

Se han añadido dos nuevas secciones principales a StudyHub Pro para mejorar la gestión académica:

### 1. 📦 Gestión de Repositorios

Una interfaz completa para gestionar tus repositorios de GitHub con:

#### Características:
- **Visualización de repositorios** con información detallada
- **Resúmenes personalizados** de cada proyecto
- **Topics/etiquetas** para organización
- **Enlaces directos** a GitHub
- **Estadísticas** (lenguaje, estrellas, última actualización)
- **Gestión completa** (añadir, editar, eliminar)

#### Datos que se almacenan:
- Nombre del repositorio
- URL de GitHub
- Descripción del proyecto
- Lenguaje principal
- Topics/etiquetas
- Fecha de última actualización
- Estado (activo/archivado)

#### Uso:
1. Navega a **"Repositorios"** en el menú lateral
2. Haz clic en **"Añadir Repositorio"**
3. Completa el formulario con la información del proyecto
4. Los repositorios se guardan en localStorage

### 2. 📅 Calendario Académico

Un sistema completo de gestión de eventos académicos:

#### Tipos de Eventos:
- 📝 **Entregas** - Trabajos y prácticas
- 📚 **Exámenes** - Pruebas y evaluaciones
- 🎤 **Presentaciones** - Exposiciones y defensas
- 👨‍🏫 **Clases** - Sesiones importantes
- 📌 **Otros** - Eventos personalizados

#### Características:
- **Calendario visual** con navegación mensual
- **Lista de próximos eventos** ordenados por fecha
- **Indicadores de urgencia** (hoy, mañana, próximos días)
- **Marcado de completados** con checkbox
- **Estadísticas** (total, pendientes, completados)
- **Detalles completos** de cada evento

#### Datos de cada evento:
- Título del evento
- Fecha
- Tipo de evento
- Asignatura
- Descripción (opcional)
- Estado (completado/pendiente)

#### Uso:
1. Navega a **"Calendario Académico"** en el menú lateral
2. Haz clic en **"Nuevo Evento"**
3. Completa el formulario
4. Los eventos aparecen en el calendario y en la lista lateral
5. Marca como completados cuando los finalices

## Archivos Creados

### JavaScript:
- **`academic-manager.js`** - Lógica completa de gestión
  - Clase `AcademicManager`
  - Gestión de repositorios
  - Gestión de calendario
  - Renderizado de vistas
  - Persistencia en localStorage

### CSS:
- **`academic-styles.css`** - Estilos premium
  - Tarjetas de repositorios
  - Calendario mensual
  - Items de eventos
  - Modales y formularios
  - Diseño responsive

### Modificaciones:
- **`index.html`**
  - Nuevos items de navegación
  - Contenedores de vistas
  - Referencias a CSS y JS

- **`app.js`**
  - Métodos `loadRepositoriesView()`
  - Métodos `loadAcademicCalendarView()`
  - Funciones globales helper

## Almacenamiento de Datos

Todos los datos se guardan en **localStorage** del navegador:

```javascript
// Repositorios
localStorage.getItem('studyhub_repositories')

// Eventos académicos
localStorage.getItem('studyhub_academic_events')
```

## Integración con GitHub

Los repositorios incluyen:
- Enlaces directos a GitHub
- Información sincronizable manualmente
- Posibilidad de integración futura con GitHub API

## Próximas Mejoras Sugeridas

1. **Integración con GitHub API**
   - Sincronización automática de repositorios
   - Obtención de estadísticas reales
   - Actualización de commits y actividad

2. **Notificaciones**
   - Recordatorios de eventos próximos
   - Alertas de entregas urgentes
   - Notificaciones del navegador

3. **Exportación/Importación**
   - Exportar calendario a .ics
   - Importar desde Google Calendar
   - Backup de datos

4. **Filtros y Búsqueda**
   - Filtrar eventos por tipo
   - Buscar repositorios por lenguaje
   - Ordenar por diferentes criterios

5. **Estadísticas Avanzadas**
   - Gráficos de actividad
   - Análisis de productividad
   - Tendencias temporales

## Diseño

El diseño sigue la estética premium de StudyHub Pro:
- **Dark mode** con efectos glassmorphism
- **Gradientes vibrantes** para acentos
- **Animaciones suaves** en interacciones
- **Responsive design** para móviles
- **Iconos SVG** personalizados

## Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Edge, Safari)
- ✅ Responsive (desktop, tablet, móvil)
- ✅ localStorage (sin necesidad de backend)
- ✅ Funciona offline

## Cómo Usar

1. **Abre StudyHub Pro** en tu navegador
2. Navega a **"Repositorios"** o **"Calendario Académico"**
3. Comienza a añadir tus datos
4. Todo se guarda automáticamente en tu navegador

¡Disfruta de la nueva funcionalidad! 🚀
