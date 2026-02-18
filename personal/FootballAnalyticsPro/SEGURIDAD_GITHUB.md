# 🔒 GUÍA DE SEGURIDAD PARA GITHUB

## ⚠️ **IMPORTANTE: NUNCA SUBAS TU API KEY A GITHUB**

Este proyecto está configurado para usar **variables de entorno** en lugar de hardcodear las API Keys.

---

## ✅ **Archivos Protegidos (Ya configurados)**

El `.gitignore` ya está configurado para ignorar:

```
# Variables de entorno
*.env
.env.local
.env.production

# Configuraciones locales
application-local.properties
*-local.properties
```

---

## 🔑 **Configuración de la API Key**

### **Opción 1: Variable de Entorno (Recomendada)**

#### Windows PowerShell (Sesión actual):
```powershell
$env:FOOTBALL_API_KEY="tu_api_key_aqui"
$env:FOOTBALL_API_URL="https://v3.football.api-sports.io"
$env:FOOTBALL_API_HOST="v3.football.api-sports.io"
```

#### Windows CMD (Permanente):
```cmd
setx FOOTBALL_API_KEY "tu_api_key_aqui"
setx FOOTBALL_API_URL "https://v3.football.api-sports.io"
setx FOOTBALL_API_HOST "v3.football.api-sports.io"
```

#### Linux/Mac:
```bash
export FOOTBALL_API_KEY="tu_api_key_aqui"
export FOOTBALL_API_URL="https://v3.football.api-sports.io"
export FOOTBALL_API_HOST="v3.football.api-sports.io"
```

### **Opción 2: Archivo .env Local (NO se sube a GitHub)**

1. Copia `.env.example` como `.env`:
   ```powershell
   copy .env.example .env
   ```

2. Edita `.env` y añade tu API Key:
   ```
   FOOTBALL_API_KEY=tu_api_key_real_aqui
   FOOTBALL_API_URL=https://v3.football.api-sports.io
   FOOTBALL_API_HOST=v3.football.api-sports.io
   ```

3. **NUNCA** hagas commit de `.env` (ya está en `.gitignore`)

---

## 📋 **Checklist Antes de Subir a GitHub**

- [ ] ✅ Verificar que `.env` está en `.gitignore`
- [ ] ✅ Verificar que NO hay API Keys en `application.properties`
- [ ] ✅ Verificar que NO hay API Keys en el código Java
- [ ] ✅ Verificar que `.env.example` NO contiene keys reales
- [ ] ✅ Ejecutar: `git status` y asegurarse de que `.env` NO aparece

---

## 🚀 **Cómo Usar el Proyecto (Para Otros Desarrolladores)**

### 1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/FootballAnalyticsPro.git
cd FootballAnalyticsPro
```

### 2. Configurar variables de entorno:
```powershell
# Copia el archivo de ejemplo
copy .env.example .env

# Edita .env y añade tu API Key
notepad .env
```

### 3. Iniciar el backend:
```powershell
cd backend
mvn spring-boot:run
```

---

## 🔐 **Buenas Prácticas**

### ✅ **HACER:**
- Usar variables de entorno para secrets
- Documentar qué variables se necesitan en `.env.example`
- Añadir archivos sensibles a `.gitignore`
- Usar diferentes keys para desarrollo y producción

### ❌ **NO HACER:**
- Hardcodear API Keys en el código
- Subir archivos `.env` a GitHub
- Compartir API Keys en chats/emails
- Usar la misma key en múltiples proyectos

---

## 🆘 **Si Expusiste tu API Key Accidentalmente**

### 1. **Revoca la Key inmediatamente:**
   - Ve a https://www.api-football.com/
   - Dashboard → API Keys
   - Revoca la key expuesta
   - Genera una nueva

### 2. **Limpia el historial de Git (si ya hiciste commit):**
   ```bash
   # CUIDADO: Esto reescribe el historial
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Fuerza el push
   git push origin --force --all
   ```

### 3. **Actualiza tu proyecto:**
   - Configura la nueva API Key en variables de entorno
   - Verifica que `.env` está en `.gitignore`
   - Haz commit de los cambios de seguridad

---

## 📊 **Endpoints Disponibles**

### **Con API Real (Requiere API Key):**
```
http://localhost:8080/api/leagues/season/2024
http://localhost:8080/api/matches/live
http://localhost:8080/api/teams/{id}
```

### **Con Datos Mock (Sin API Key):**
```
http://localhost:8080/api/mock/competitions
http://localhost:8080/api/mock/live
http://localhost:8080/api/mock/today
http://localhost:8080/api/mock/standings/140/2024
http://localhost:8080/api/mock/team/486
http://localhost:8080/api/mock/squad/486
http://localhost:8080/api/mock/stats/486
```

---

## 🎯 **Configuración para Producción**

### **Heroku:**
```bash
heroku config:set FOOTBALL_API_KEY=tu_key_aqui
heroku config:set FOOTBALL_API_URL=https://v3.football.api-sports.io
heroku config:set FOOTBALL_API_HOST=v3.football.api-sports.io
```

### **Docker:**
```dockerfile
# En docker-compose.yml
environment:
  - FOOTBALL_API_KEY=${FOOTBALL_API_KEY}
  - FOOTBALL_API_URL=${FOOTBALL_API_URL}
  - FOOTBALL_API_HOST=${FOOTBALL_API_HOST}
```

### **AWS/Azure/GCP:**
- Usa sus servicios de secrets management
- AWS: Secrets Manager
- Azure: Key Vault
- GCP: Secret Manager

---

## 📝 **Resumen**

1. ✅ **API Keys configuradas como variables de entorno**
2. ✅ **`.env` protegido por `.gitignore`**
3. ✅ **`.env.example` sin datos sensibles**
4. ✅ **Datos mock disponibles para desarrollo**
5. ✅ **Documentación completa de seguridad**

---

## 🔗 **Enlaces Útiles**

- **API-Football Dashboard**: https://www.api-football.com/
- **Documentación API**: https://www.api-football.com/documentation-v3
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

**¡Tu proyecto está seguro para GitHub!** 🎉

**Desarrollado por Luis Cendán © 2026**
