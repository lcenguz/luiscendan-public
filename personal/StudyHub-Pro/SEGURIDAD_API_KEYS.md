# 🔒 GUÍA DE SEGURIDAD - API Keys

## ⚠️ IMPORTANTE: Nunca compartas tu API key

Tu API key es como una **contraseña** que da acceso a tu cuenta de IA. Si alguien la obtiene, puede:
- ❌ Usar tu cuenta y gastar tu crédito
- ❌ Hacer peticiones en tu nombre
- ❌ Acceder a tus datos

## ✅ FORMA SEGURA: Variables de Entorno

### Opción 1: Variable de Entorno Permanente (RECOMENDADA)

```powershell
# Crear variable de entorno del usuario (persiste entre reinicios)
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'tu-key-real-aqui', 'User')

# Reiniciar PowerShell

# Verificar
echo $env:GEMINI_API_KEY
```

**Ventajas:**
- ✅ La key NO está en ningún archivo del proyecto
- ✅ NO se puede subir a Git accidentalmente
- ✅ Funciona para todos tus proyectos
- ✅ Persiste entre reinicios del sistema

---

### Opción 2: Archivo Local (SEGURA)

#### Paso 1: Crear archivo de configuración local

```powershell
# Navega a la carpeta de recursos
cd backend\src\main\resources

# Copia el template
Copy-Item application-local.properties.template application-local.properties

# Edita el archivo (se abrirá en tu editor)
notepad application-local.properties
```

#### Paso 2: Configurar tu key

Abre `application-local.properties` y reemplaza:

```properties
# Cambia esto:
ai.gemini.api-key=PON_TU_KEY_DE_GEMINI_AQUI

# Por tu key real:
ai.gemini.api-key=AIzaSyC_tu_key_real_aqui_1234567890
```

#### Paso 3: Verificar que está protegido

```powershell
# Este archivo NO debe aparecer en Git
git status

# Si aparece, añádelo manualmente al .gitignore
echo "application-local.properties" >> .gitignore
```

**Ventajas:**
- ✅ Fácil de configurar
- ✅ Ya está en `.gitignore`
- ✅ Solo existe en tu computadora

---

## 🛡️ Checklist de Seguridad

Antes de usar tu API key, verifica:

- [ ] ✅ El archivo `.gitignore` incluye `application-local.properties`
- [ ] ✅ Nunca pusiste la key en `application.properties` (el archivo principal)
- [ ] ✅ No compartiste la key en chats, emails, o capturas de pantalla
- [ ] ✅ Si usas Git, ejecuta `git status` para verificar que no se suba

---

## 🚨 ¿Qué hacer si expones tu API key?

Si accidentalmente compartiste o subiste tu API key:

### 1. **Revoca la key inmediatamente**

#### Para Google Gemini:
1. Ve a: https://makersuite.google.com/app/apikey
2. Encuentra tu key
3. Click en el icono de **eliminar** (🗑️)
4. Crea una nueva key

#### Para OpenAI:
1. Ve a: https://platform.openai.com/api-keys
2. Encuentra tu key
3. Click en **Revoke**
4. Crea una nueva key

### 2. **Actualiza tu configuración**

```powershell
# Actualiza la variable de entorno
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'tu-NUEVA-key', 'User')

# O actualiza application-local.properties con la nueva key
```

### 3. **Verifica el historial de Git**

```powershell
# Si subiste la key a Git, necesitas limpiar el historial
# Esto es avanzado, mejor prevenir que curar
```

---

## 📝 Mejores Prácticas

### ✅ HACER:
- ✅ Usar variables de entorno
- ✅ Usar archivos `-local.properties`
- ✅ Verificar `.gitignore` antes de commit
- ✅ Rotar (cambiar) keys periódicamente
- ✅ Usar keys diferentes para desarrollo y producción

### ❌ NO HACER:
- ❌ Poner keys en `application.properties` (archivo principal)
- ❌ Hardcodear keys en el código Java
- ❌ Compartir keys en screenshots
- ❌ Subir keys a GitHub/GitLab
- ❌ Enviar keys por email o chat
- ❌ Usar la misma key en múltiples proyectos públicos

---

## 🔍 Verificar Seguridad Antes de Commit

Antes de hacer `git commit`, ejecuta:

```powershell
# Ver qué archivos se van a subir
git status

# Ver el contenido que se va a subir
git diff

# Buscar posibles keys en el código
git grep -i "api.key"
git grep -i "AIza"  # Gemini keys empiezan con AIza
git grep -i "sk-"   # OpenAI keys empiezan con sk-
```

Si encuentras alguna key, **NO hagas commit**. Elimínala primero.

---

## 🎯 Configuración Recomendada para Ti

### Para Desarrollo Local (tu computadora):

**Usa Variable de Entorno:**

```powershell
# Una sola vez
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'tu-key', 'User')
```

**Ventaja:** Nunca se sube a Git, funciona automáticamente.

### Para Producción (servidor):

Usa variables de entorno del sistema o servicios como:
- Azure Key Vault
- AWS Secrets Manager
- Google Secret Manager

---

## 📊 Niveles de Seguridad

| Método | Seguridad | Facilidad | Recomendado |
|--------|-----------|-----------|-------------|
| Variable de Entorno | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ SÍ |
| Archivo `-local.properties` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ SÍ |
| Archivo `.env` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ SÍ |
| `application.properties` | ⭐ | ⭐⭐⭐⭐⭐ | ❌ NO |
| Hardcoded en código | ⭐ | ⭐⭐⭐ | ❌ NUNCA |

---

## 🎓 Resumen: Configuración Segura en 3 Pasos

### Paso 1: Obtener tu API key
```
Ve a: https://makersuite.google.com/app/apikey
Crea tu key
Cópiala (solo se muestra una vez)
```

### Paso 2: Configurarla de forma segura
```powershell
# Opción A: Variable de entorno (recomendada)
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'tu-key', 'User')

# Opción B: Archivo local
# Edita: backend/src/main/resources/application-local.properties
# ai.gemini.api-key=tu-key
```

### Paso 3: Verificar seguridad
```powershell
# Verificar que NO se sube a Git
git status

# Debe mostrar que application-local.properties está ignorado
```

---

## ✅ Tu proyecto YA está configurado de forma segura

He configurado tu proyecto con:
- ✅ `.gitignore` actualizado para proteger keys
- ✅ Template de configuración local
- ✅ Instrucciones claras en los archivos
- ✅ Múltiples capas de protección

**¡Solo necesitas obtener tu key y configurarla!** 🔒

---

## 🆘 ¿Necesitas Ayuda?

Si tienes dudas sobre seguridad:
1. Lee esta guía completa
2. Verifica el `.gitignore`
3. Usa variables de entorno cuando sea posible
4. Nunca compartas tu key

**Recuerda: Es mejor prevenir que lamentar.** 🛡️
