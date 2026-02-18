# 🎓 StudyHub Pro - Tu Asistente Personal de Estudio con IA

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI%20%7C%20Claude-purple.svg)

**Una aplicación web moderna y profesional para estudiantes que integra IA para potenciar tu aprendizaje**

[🚀 Inicio Rápido](#-inicio-rápido) • [✨ Características](#-características) • [📖 Documentación](#-documentación) • [🛠️ Tecnologías](#️-tecnologías)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características](#-características)
- [Inicio Rápido](#-inicio-rápido)
- [Tecnologías](#️-tecnologías)
- [Arquitectura](#-arquitectura)
- [Configuración de IA](#-configuración-de-ia)
- [Uso](#-uso)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 Acerca del Proyecto

**StudyHub Pro** es una aplicación web de última generación diseñada para revolucionar la forma en que estudias. Combina una interfaz moderna y elegante con el poder de la inteligencia artificial para ofrecerte un asistente personal de estudio que te ayuda a:

- 📝 Organizar tus notas y apuntes
- ✅ Gestionar tareas y deadlines
- 🤖 Interactuar con IA para resolver dudas
- 📊 Generar resúmenes, flashcards y quizzes automáticamente
- 📁 Centralizar todos tus materiales de estudio

### 🌟 Lo que hace especial a StudyHub Pro:

- **100% Frontend**: No requiere servidor backend, funciona completamente en tu navegador
- **Privacidad Total**: Todos tus datos se guardan localmente en tu dispositivo
- **IA Integrada**: Conexión directa con Gemini, OpenAI o Claude
- **Diseño Premium**: Interfaz oscura moderna con efectos glassmorphism
- **Multiplataforma**: Funciona en Windows, Mac, Linux y móviles
- **Offline-Ready**: Funciona sin conexión (excepto funciones de IA)

---

## ✨ Características

### 📚 Gestión de Contenido

- **Notas Inteligentes**
  - Editor de texto enriquecido
  - Organización por asignaturas
  - Búsqueda rápida y filtros
  - Etiquetas y categorías

- **Sistema de Tareas**
  - Creación rápida de tareas
  - Prioridades (Alta, Media, Baja)
  - Fechas límite con recordatorios
  - Estado de completado

- **Biblioteca Digital**
  - Almacenamiento de archivos
  - Soporte para PDF, imágenes, documentos
  - Vista unificada de todo tu contenido
  - Búsqueda global

### 🤖 Funcionalidades de IA

- **Chat Inteligente**
  - Conversación natural con IA
  - Contexto de tus materiales
  - Respuestas humanizadas
  - Historial de conversaciones

- **Generación Automática**
  - 📝 Resúmenes de textos
  - 🎴 Flashcards para memorización
  - ❓ Quizzes de autoevaluación
  - ✍️ Explicaciones personalizadas

- **Análisis de Documentos**
  - Extracción de información clave
  - Respuestas basadas en tus archivos
  - Comprensión de contexto

### 🎨 Interfaz y UX

- **Diseño Dark-Mode Premium**
  - Paleta de colores cuidadosamente seleccionada
  - Efectos glassmorphism y gradientes
  - Animaciones suaves y micro-interacciones
  - Tipografía moderna (Inter, JetBrains Mono)

- **Dashboard Interactivo**
  - Estadísticas en tiempo real
  - Calendario integrado
  - Acciones rápidas
  - Actividad reciente

- **Responsive Design**
  - Adaptado para desktop, tablet y móvil
  - Navegación intuitiva
  - Accesibilidad optimizada

---

## 🚀 Inicio Rápido

### Opción 1: Uso Inmediato (Recomendado)

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/studyhub-pro.git
cd studyhub-pro

# 2. Abre la aplicación
# Windows
.\start-app.ps1

# O simplemente abre index.html en tu navegador
```

### Opción 2: Servidor Local

```bash
# Python
python -m http.server 8000

# Node.js
npx -y serve .

# PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

### Opción 3: Despliegue Online

**GitHub Pages** (Gratis)
```bash
# Sube a GitHub y activa Pages en Settings
```

**Netlify** (Gratis)
```bash
# Arrastra la carpeta a https://app.netlify.com/drop
```

**Vercel** (Gratis)
```bash
npx vercel
```

---

## 🛠️ Tecnologías

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript (ES6+)** - Lógica de aplicación
- **IndexedDB** - Almacenamiento local

### APIs de IA
- **Google Gemini** - IA gratuita y potente
- **OpenAI GPT-4** - Modelo de lenguaje avanzado
- **Anthropic Claude** - IA conversacional

### Herramientas
- **Git** - Control de versiones
- **PowerShell** - Scripts de automatización

---

## 🏗️ Arquitectura

```
StudyHub-Pro/
├── index.html              # Aplicación principal
├── styles.css              # Sistema de diseño
├── app.js                  # Lógica de aplicación
├── ai-config.js            # Configuración de IA
├── start-app.ps1           # Script de inicio
├── README.md               # Este archivo
├── README_SERVERLESS.md    # Guía serverless
└── backend/                # Backend opcional (Java)
    ├── src/
    └── pom.xml
```

### Flujo de Datos

```
Usuario → Interfaz → App.js → IndexedDB (Local)
                    ↓
                 AI Config → API de IA (Gemini/OpenAI/Claude)
                    ↓
                 Respuesta → Humanizador → Usuario
```

---

## 🔧 Configuración de IA

### 1. Obtener API Key

#### Google Gemini (GRATIS - Recomendado)
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un proyecto
3. Genera una API key
4. Copia la key

#### OpenAI
1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una cuenta
3. Genera una API key
4. Copia la key (empieza con `sk-`)

#### Anthropic Claude
1. Ve a [Anthropic Console](https://console.anthropic.com/)
2. Crea una cuenta
3. Genera una API key
4. Copia la key

### 2. Configurar en la App

1. Abre StudyHub Pro
2. Ve a **Configuración** (⚙️)
3. Selecciona tu proveedor de IA
4. Pega tu API key
5. Haz clic en **Guardar Configuración**
6. ¡Listo! Ya puedes usar todas las funciones de IA

---

## 📖 Uso

### Crear una Nota

1. Ve a **Notas** en el menú lateral
2. Haz clic en **Nueva Nota**
3. Completa título, asignatura y contenido
4. Haz clic en **Guardar Nota**

### Usar el Chat de IA

1. Ve a **IA Personal**
2. Escribe tu pregunta en el chat
3. Presiona Enter o haz clic en **Enviar**
4. La IA responderá en segundos

### Generar Resumen

1. Crea una nota con contenido
2. Ve a **IA Personal**
3. Haz clic en **Generar Resumen**
4. La IA creará un resumen automáticamente
5. Guárdalo como nueva nota si quieres

### Gestionar Tareas

1. Ve a **Agenda**
2. Haz clic en **Nueva Tarea**
3. Completa los detalles
4. Marca como completada cuando termines

---

## 📸 Capturas de Pantalla

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Chat de IA
![AI Chat](docs/screenshots/ai-chat.png)

### Notas
![Notes](docs/screenshots/notes.png)

### Configuración
![Settings](docs/screenshots/settings.png)

---

## 🗺️ Roadmap

### Versión 1.1 (Próximamente)
- [ ] Sincronización en la nube
- [ ] Colaboración en tiempo real
- [ ] Modo presentación
- [ ] Exportar a PDF

### Versión 1.2
- [ ] Aplicación móvil nativa
- [ ] Reconocimiento de voz
- [ ] Análisis de imágenes con IA
- [ ] Integración con calendarios

### Versión 2.0
- [ ] Modo multijugador
- [ ] Gamificación
- [ ] Estadísticas avanzadas
- [ ] Recomendaciones personalizadas

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar StudyHub Pro:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 👨‍💻 Autor

**Luis Cendán**

- GitHub: [@luiscendan](https://github.com/luiscendan)
- Email: tu-email@ejemplo.com

---

## 🙏 Agradecimientos

- [Google Fonts](https://fonts.google.com/) - Tipografías Inter y JetBrains Mono
- [Heroicons](https://heroicons.com/) - Iconos SVG
- [Google Gemini](https://ai.google.dev/) - API de IA gratuita
- [OpenAI](https://openai.com/) - GPT-4 API
- [Anthropic](https://www.anthropic.com/) - Claude API

---

<div align="center">

**¿Te gusta StudyHub Pro? ¡Dale una ⭐ en GitHub!**

[⬆ Volver arriba](#-studyhub-pro---tu-asistente-personal-de-estudio-con-ia)

</div>
