# 🚀 GUÍA DE INICIO RÁPIDO - StudyHub Pro

## ⚠️ IMPORTANTE: Configuración de PowerShell

Si tienes problemas ejecutando comandos npm/npx, ejecuta esto en PowerShell como **Administrador**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎯 Inicio Rápido (Recomendado)

### Opción 1: Usar Scripts PowerShell

```powershell
# Verificar que todo esté configurado correctamente (sin ejecutar)
.\verify-backend.ps1

# Iniciar el backend
.\start-backend.ps1
```

Los scripts automáticamente:
- ✅ Verifican y cierran procesos Java conflictivos
- ✅ Compilan el proyecto
- ✅ Muestran la configuración actual
- ✅ Inician el servidor

### Opción 2: Comandos Manuales

## 📋 Pasos de Instalación

### 1️⃣ Backend (Java Spring Boot)

```bash
cd backend

# Compilar el proyecto
mvn clean install

# Ejecutar el backend
mvn spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

### 2️⃣ Frontend (Angular)

#### Opción A: Crear proyecto Angular automáticamente

```bash
cd StudyHub-Pro

# Crear proyecto Angular
npx @angular/cli@latest new frontend --routing --style=scss --skip-git --standalone

cd frontend

# Instalar Angular Material
ng add @angular/material

# Ejecutar
ng serve
```

#### Opción B: Si npx no funciona

1. **Habilita scripts en PowerShell** (como Administrador):
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Instala Angular CLI globalmente**:
   ```bash
   npm install -g @angular/cli
   ```

3. **Crea el proyecto**:
   ```bash
   cd StudyHub-Pro
   ng new frontend --routing --style=scss --skip-git --standalone
   cd frontend
   ng add @angular/material
   ```

El frontend estará disponible en: **http://localhost:4200**

## 🔧 Configuración de IA

### Opción 1: Variables de Entorno (Recomendado)

```bash
# Windows PowerShell
$env:OPENAI_API_KEY="tu-api-key-aqui"

# Windows CMD
set OPENAI_API_KEY=tu-api-key-aqui

# Linux/Mac
export OPENAI_API_KEY=tu-api-key-aqui
```

### Opción 2: Archivo application.properties

Edita `backend/src/main/resources/application.properties`:

```properties
ai.provider=openai
ai.openai.api-key=tu-api-key-aqui
```

## 🎯 Proveedores de IA Soportados

### OpenAI (GPT-4)
- Obtén tu API key: https://platform.openai.com/api-keys
- Configura: `ai.openai.api-key=sk-...`

### Google Gemini
- Obtén tu API key: https://makersuite.google.com/app/apikey
- Configura: `ai.gemini.api-key=...`

### Anthropic Claude
- Obtén tu API key: https://console.anthropic.com/
- Configura: `ai.claude.api-key=...`

## 📊 Verificar que todo funciona

### 1. Backend
```bash
# Debería responder con información de la API
curl http://localhost:8080/api/notes

# Debería mostrar []
```

### 2. Frontend
Abre http://localhost:4200 en tu navegador

### 3. Probar IA
```bash
# Enviar mensaje de prueba
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explícame qué es una derivada",
    "provider": "openai",
    "subject": "matemáticas",
    "studentLevel": "básico"
  }'
```

## 🗄️ Base de Datos

### H2 Console (Desarrollo)
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:studyhub`
- Usuario: `sa`
- Password: (vacío)

**Nota:** La base de datos está en modo memoria, por lo que los datos se perderán al reiniciar el backend.

### Cambiar a PostgreSQL (Producción)

1. Instala PostgreSQL
2. Crea la base de datos:
   ```sql
   CREATE DATABASE studyhub;
   ```
3. Edita `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/studyhub
   spring.datasource.username=postgres
   spring.datasource.password=tu_password
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```

## 🎨 Estructura del Proyecto

```
StudyHub-Pro/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   │   └── com/studyhub/
│   │       ├── ai/         # ⭐ Humanizador de IA
│   │       ├── controller/ # REST endpoints
│   │       ├── service/    # Lógica de negocio
│   │       ├── model/      # Entidades
│   │       └── repository/ # Acceso a datos
│   └── pom.xml
│
├── frontend/                # Angular app
│   ├── src/app/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   └── package.json
│
├── index.html              # Demo HTML/JS (opcional)
├── styles.css
└── app.js
```

## 🐛 Solución de Problemas

### Error: "Database may be already in use" / "The file is locked"
Este error ocurre cuando hay múltiples instancias del backend intentando acceder a la misma base de datos.

**Solución automática:**
```powershell
.\verify-backend.ps1  # Detecta y cierra procesos Java
```

**Solución manual:**
```powershell
# Cerrar todos los procesos Java
taskkill /F /IM java.exe

# Luego reiniciar el backend
cd backend
mvn spring-boot:run
```

**Nota:** Ahora usamos H2 en modo memoria (`jdbc:h2:mem:studyhub`) que evita este problema, pero los datos se pierden al reiniciar.

### Error: "Cannot run scripts"
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Port 8080 already in use"
```bash
# Cambiar puerto en application.properties
server.port=8081
```

### Error: "API key not configured"
- Verifica que hayas configurado la API key
- Reinicia el backend después de configurarla

### Error de CORS
- Verifica que el frontend esté en http://localhost:4200
- Revisa `CorsConfig.java` si usas otro puerto

## 📚 Próximos Pasos

1. ✅ **Backend funcionando** → Prueba los endpoints con curl o Postman
2. ✅ **Frontend creado** → Personaliza componentes Angular
3. ✅ **IA configurada** → Prueba el chat y el humanizador
4. 🔜 **Sube archivos** → Prueba con PDF, PowerPoint, imágenes
5. 🔜 **Crea notas** → Organiza tus apuntes
6. 🔜 **Gestiona tareas** → Planifica tu estudio

## 🎓 Recursos Útiles

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Angular Docs](https://angular.io/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)

---

**¿Necesitas ayuda?** Revisa el README.md principal o los comentarios en el código.

¡Disfruta de tu asistente personal de estudio! 🚀📚
