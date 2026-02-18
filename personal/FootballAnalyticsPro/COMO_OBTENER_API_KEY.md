# 🔑 Cómo Obtener tu API Key de API-Football

## Paso 1: Registro

1. Ve a: https://www.api-football.com/
2. Haz clic en **"SIGN IN"** (esquina superior derecha)
3. Selecciona **"Sign Up"** (Registrarse)
4. Puedes registrarte con:
   - Email y contraseña
   - GitHub
   - Google

## Paso 2: Verificar Email

1. Revisa tu email
2. Haz clic en el enlace de verificación

## Paso 3: Obtener la API Key

1. Inicia sesión en https://www.api-football.com/
2. Ve a **"My Account"** o **"Dashboard"**
3. Busca la sección **"Your API Key"**
4. **Copia** la API Key (algo como: `1234567890abcdef1234567890abcdef`)

## Paso 4: Configurar en el Proyecto

1. Abre el archivo:
   ```
   backend/src/main/resources/application.properties
   ```

2. Busca la línea:
   ```properties
   api.football.key=YOUR_API_KEY_HERE
   ```

3. Reemplázala con tu API Key:
   ```properties
   api.football.key=1234567890abcdef1234567890abcdef
   ```

4. **Guarda el archivo**

## Plan Gratuito

✅ **100 requests por día**
✅ Acceso a todas las ligas
✅ Datos en tiempo real
✅ Estadísticas completas
✅ Sin tarjeta de crédito

## Planes de Pago (Opcional)

Si necesitas más requests:

| Plan | Requests/día | Precio/mes |
|------|--------------|------------|
| Free | 100 | $0 |
| Basic | 1,000 | $10 |
| Pro | 10,000 | $25 |
| Ultra | 100,000 | $75 |

## Importante

⚠️ **NO compartas tu API Key públicamente**
⚠️ **NO la subas a GitHub** (ya está en .gitignore)
⚠️ **Guárdala de forma segura**

## Verificar que Funciona

Una vez configurada, puedes probar con:

```bash
curl -X GET "https://v3.football.api-sports.io/leagues?season=2024" \
  -H "x-rapidapi-key: TU_API_KEY" \
  -H "x-rapidapi-host: v3.football.api-sports.io"
```

---

**¿Ya tienes tu API Key?** 

Cópiala y pégala en `application.properties` en la línea:
```
api.football.key=AQUI_TU_API_KEY
```

Luego podremos iniciar el backend! 🚀
