# ⚡ COMANDOS RÁPIDOS - StudyHub Pro

## 🚀 Inicio Rápido (Copiar y Pegar)

### 1️⃣ Iniciar Backend

```powershell
cd backend
mvn spring-boot:run
```

**URL:** http://localhost:8080

---

### 2️⃣ Configurar API de IA (Elige una opción)

#### Opción A: Variable de Entorno (Temporal)
```powershell
# OpenAI
$env:OPENAI_API_KEY="sk-tu-api-key-aqui"

# Google Gemini
$env:GEMINI_API_KEY="tu-api-key-aqui"

# Anthropic Claude
$env:CLAUDE_API_KEY="tu-api-key-aqui"
```

#### Opción B: Archivo de Configuración (Permanente)
Edita: `backend/src/main/resources/application.properties`
```properties
ai.provider=openai
ai.openai.api-key=sk-tu-api-key-aqui
```

---

### 3️⃣ Probar la API

```powershell
# Ejecutar script de prueba
.\test-api.ps1

# O probar manualmente
curl http://localhost:8080/api/notes
```

---

### 4️⃣ Crear Frontend Angular (Opcional)

```powershell
# Habilitar scripts (solo una vez, como Administrador)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Crear proyecto
npx @angular/cli@latest new frontend --routing --style=scss --skip-git --standalone

# Instalar Material
cd frontend
ng add @angular/material

# Ejecutar
ng serve
```

**URL:** http://localhost:4200

---

## 🧪 Pruebas Rápidas con curl/Invoke-RestMethod

### Crear Nota
```powershell
$noteBody = @{
    title = "Mi primera nota"
    content = "Contenido de la nota"
    subject = "Matemáticas"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/notes" -Method POST -Body $noteBody -ContentType "application/json"
```

### Crear Tarea
```powershell
$taskBody = @{
    title = "Estudiar para examen"
    description = "Repasar temas 1-5"
    priority = "HIGH"
    dueDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/tasks" -Method POST -Body $taskBody -ContentType "application/json"
```

### Probar IA (requiere API key configurada)
```powershell
$aiBody = @{
    query = "Explícame qué es una derivada"
    provider = "openai"
    subject = "matemáticas"
    studentLevel = "básico"
    firstInteraction = $true
    needsExamples = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/ai/chat" -Method POST -Body $aiBody -ContentType "application/json"
```

### Subir Archivo
```powershell
# Crear un archivo de prueba
"Contenido de prueba" | Out-File -FilePath "test.txt"

# Subir
$file = Get-Item "test.txt"
$form = @{
    file = $file
    subject = "Programación"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/ai/upload" -Method POST -Form $form
```

---

## 🔍 Consultas Útiles

### Ver todas las notas
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/notes"
```

### Buscar notas
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/notes/search?query=matemáticas"
```

### Ver tareas pendientes
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/tasks?completed=false"
```

### Ver estadísticas de tareas
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/tasks/stats"
```

### Ver historial de IA
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/ai/history"
```

### Ver estadísticas de IA
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/ai/stats"
```

---

## 🗄️ Base de Datos H2

### Acceder a la consola
1. Abre: http://localhost:8080/h2-console
2. JDBC URL: `jdbc:h2:file:./data/studyhub`
3. Usuario: `sa`
4. Password: (vacío)

### Consultas SQL útiles
```sql
-- Ver todas las notas
SELECT * FROM notes ORDER BY created_at DESC;

-- Ver todas las tareas
SELECT * FROM tasks ORDER BY due_date ASC;

-- Ver conversaciones con IA
SELECT * FROM ai_chats ORDER BY created_at DESC;

-- Contar notas por asignatura
SELECT subject, COUNT(*) as total 
FROM notes 
GROUP BY subject;

-- Ver tareas pendientes de alta prioridad
SELECT * FROM tasks 
WHERE completed = false AND priority = 'HIGH'
ORDER BY due_date ASC;
```

---

## 🛠️ Comandos de Desarrollo

### Compilar sin ejecutar
```powershell
cd backend
mvn clean install
```

### Ejecutar tests
```powershell
mvn test
```

### Limpiar y recompilar
```powershell
mvn clean package
```

### Ver dependencias
```powershell
mvn dependency:tree
```

---

## 🔧 Solución Rápida de Problemas

### Puerto 8080 ocupado
```powershell
# Cambiar puerto en application.properties
# server.port=8081
```

### Limpiar base de datos
```powershell
# Eliminar carpeta data
Remove-Item -Recurse -Force backend/data
```

### Reiniciar todo
```powershell
# Detener backend (Ctrl+C)
# Limpiar
cd backend
mvn clean
Remove-Item -Recurse -Force data

# Reiniciar
mvn spring-boot:run
```

### Ver logs en tiempo real
```powershell
# Los logs aparecen automáticamente en la consola
# Para más detalle, edita application.properties:
# logging.level.com.studyhub=DEBUG
```

---

## 📊 Monitoreo

### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"
```

### Info de la aplicación
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/actuator/info"
```

---

## 🎯 Flujo de Trabajo Típico

### 1. Iniciar sesión de estudio
```powershell
# 1. Iniciar backend
cd backend
mvn spring-boot:run

# 2. En otra terminal, probar que funciona
.\test-api.ps1
```

### 2. Trabajar con notas
```powershell
# Crear nota
$nota = @{
    title = "Apuntes de Cálculo"
    content = "Derivadas e integrales..."
    subject = "Matemáticas"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/notes" -Method POST -Body $nota -ContentType "application/json"

# Ver todas las notas
Invoke-RestMethod -Uri "http://localhost:8080/api/notes"
```

### 3. Usar IA para estudiar
```powershell
# Hacer pregunta
$pregunta = @{
    query = "Ayúdame a resolver: ∫x² dx"
    provider = "openai"
    subject = "matemáticas"
    studentLevel = "básico"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/ai/chat" -Method POST -Body $pregunta -ContentType "application/json"
```

### 4. Subir y analizar PDF
```powershell
# Subir PDF
$pdf = Get-Item "mi_apunte.pdf"
$form = @{ file = $pdf; subject = "Física" }

$resultado = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/upload" -Method POST -Form $form

# Ver texto extraído
$resultado.extractedText
```

---

## 🎓 Obtener API Keys

### OpenAI (GPT-4)
1. Ir a: https://platform.openai.com/api-keys
2. Crear cuenta / Iniciar sesión
3. Click en "Create new secret key"
4. Copiar la key (empieza con `sk-`)

### Google Gemini
1. Ir a: https://makersuite.google.com/app/apikey
2. Iniciar sesión con Google
3. Click en "Create API Key"
4. Copiar la key

### Anthropic Claude
1. Ir a: https://console.anthropic.com/
2. Crear cuenta
3. Settings → API Keys
4. Create Key

---

## 📝 Atajos de Teclado (cuando crees el frontend)

```
Ctrl + N  → Nueva nota
Ctrl + T  → Nueva tarea
Ctrl + K  → Abrir chat IA
Ctrl + U  → Subir archivo
Ctrl + S  → Guardar
Esc       → Cerrar modal
```

---

## 🚀 Comandos de Producción (Futuro)

### Compilar para producción
```powershell
cd backend
mvn clean package -DskipTests

# El JAR estará en: target/studyhub-backend-1.0.0.jar
```

### Ejecutar JAR
```powershell
java -jar target/studyhub-backend-1.0.0.jar
```

### Con variables de entorno
```powershell
$env:SPRING_PROFILES_ACTIVE="production"
$env:OPENAI_API_KEY="tu-key"
java -jar target/studyhub-backend-1.0.0.jar
```

---

**💡 Tip:** Guarda este archivo en tus favoritos para acceso rápido a los comandos más usados.
