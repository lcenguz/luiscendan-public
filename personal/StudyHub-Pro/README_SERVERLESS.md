# 🚀 StudyHub Pro - Versión Serverless (Sin Backend)

## ✨ Características

Esta versión de StudyHub Pro funciona **completamente en el navegador** sin necesidad de un servidor backend:

- ✅ **100% Frontend**: HTML, CSS y JavaScript puro
- ✅ **Sin instalación**: Solo abre `index.html` en tu navegador
- ✅ **Almacenamiento local**: Usa IndexedDB para guardar tus datos
- ✅ **Conexión directa a IA**: Se conecta directamente a APIs de IA (Gemini, OpenAI, Claude)
- ✅ **Offline-ready**: Funciona sin conexión (excepto para IA)
- ✅ **Multiplataforma**: Windows, Mac, Linux

## 🎯 Inicio Rápido

### Opción 1: Abrir directamente (Recomendado)

1. Navega a la carpeta del proyecto
2. Haz doble clic en `index.html`
3. ¡Listo! La aplicación se abrirá en tu navegador

### Opción 2: Servidor local (para desarrollo)

```powershell
# Opción A: Python
python -m http.server 8000

# Opción B: Node.js (npx)
npx -y serve .

# Opción C: PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

## 🔧 Configuración de IA

### 1. Obtener API Keys

#### Google Gemini (Recomendado - GRATIS)
1. Ve a: https://makersuite.google.com/app/apikey
2. Crea una API key
3. Copia la key

#### OpenAI (GPT-4)
1. Ve a: https://platform.openai.com/api-keys
2. Crea una API key
3. Copia la key (empieza con `sk-`)

#### Anthropic Claude
1. Ve a: https://console.anthropic.com/
2. Crea una API key
3. Copia la key

### 2. Configurar en la App

1. Abre StudyHub Pro
2. Ve a **Configuración** (⚙️)
3. Pega tu API key
4. Selecciona el proveedor (Gemini, OpenAI, Claude)
5. ¡Listo!

## 📊 Funcionalidades

### ✅ Disponibles SIN configurar IA:
- 📝 Crear y gestionar notas
- ✅ Crear y completar tareas
- 📅 Ver calendario
- 📁 Subir y organizar archivos
- 📊 Dashboard con estadísticas
- 🔍 Búsqueda en biblioteca

### 🤖 Disponibles CON IA configurada:
- 💬 Chat con IA personal
- 📄 Analizar documentos (PDF, imágenes, etc.)
- 📝 Generar resúmenes automáticos
- 🎴 Crear flashcards
- ❓ Generar quizzes
- 🧠 Resolver ejercicios
- ✍️ Humanizar respuestas de IA

## 💾 Almacenamiento de Datos

Todos tus datos se guardan **localmente en tu navegador** usando IndexedDB:

- **Notas**: Tus apuntes y contenido
- **Tareas**: Tu lista de tareas pendientes
- **Archivos**: Información de archivos subidos
- **Chats IA**: Historial de conversaciones
- **Configuración**: API keys y preferencias

### ⚠️ Importante:
- Los datos NO se sincronizan entre dispositivos
- Si borras los datos del navegador, perderás todo
- Recomendamos hacer backups periódicos

## 🔒 Seguridad y Privacidad

### ✅ Tus datos están seguros:
- Todo se guarda **localmente** en tu navegador
- Las API keys se almacenan **solo en tu dispositivo**
- No hay servidores externos que almacenen tu información
- Las llamadas a IA se hacen **directamente desde tu navegador**

### 🛡️ Mejores prácticas:
- No compartas tus API keys
- Usa la versión HTTPS si despliegas online
- Revoca API keys si sospechas que están comprometidas

## 📁 Estructura del Proyecto

```
StudyHub-Pro/
├── index.html          # Aplicación principal
├── styles.css          # Estilos premium
├── app.js              # Lógica de la aplicación
├── ai-config.js        # Configuración de IA (NUEVO)
└── README_SERVERLESS.md # Esta guía
```

## 🌐 Despliegue Online

### GitHub Pages (Gratis)

1. Sube el proyecto a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main`
4. ¡Tu app estará en `https://tu-usuario.github.io/studyhub-pro`!

### Netlify (Gratis)

1. Arrastra la carpeta a https://app.netlify.com/drop
2. ¡Listo! Tu app estará online

### Vercel (Gratis)

```bash
npx vercel
```

## 🆚 Comparación: Serverless vs Backend

| Característica | Serverless | Con Backend Java |
|---------------|------------|------------------|
| Instalación | ✅ Ninguna | ❌ Java, Maven, etc. |
| Velocidad | ✅ Instantánea | ⚠️ Requiere compilar |
| Portabilidad | ✅ Funciona en cualquier lugar | ❌ Necesita servidor |
| Datos | ⚠️ Solo local | ✅ Base de datos |
| Sincronización | ❌ No | ✅ Sí |
| Complejidad | ✅ Simple | ❌ Compleja |
| Costo | ✅ Gratis | ⚠️ Hosting necesario |

## 🐛 Solución de Problemas

### La IA no responde
- Verifica que hayas configurado la API key
- Comprueba que tienes conexión a internet
- Revisa la consola del navegador (F12) para errores
- Verifica que la API key sea válida

### Los datos no se guardan
- Asegúrate de no estar en modo incógnito
- Verifica que IndexedDB esté habilitado en tu navegador
- Comprueba el espacio de almacenamiento disponible

### Error de CORS al usar IA
- Esto es normal con algunas APIs
- Usa la extensión "CORS Unblock" en Chrome
- O despliega la app en un servidor (no abras el HTML directamente)

## 📚 Próximos Pasos

1. ✅ **Configura tu IA** → Ve a Configuración
2. ✅ **Crea tu primera nota** → Prueba el sistema
3. ✅ **Sube un archivo** → Prueba con un PDF
4. ✅ **Pregunta a la IA** → Prueba el chat
5. ✅ **Crea tareas** → Organiza tu estudio

## 🎓 Recursos Útiles

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

**¿Preguntas?** Revisa la consola del navegador (F12) para más información.

¡Disfruta de tu asistente personal de estudio sin servidor! 🚀📚
