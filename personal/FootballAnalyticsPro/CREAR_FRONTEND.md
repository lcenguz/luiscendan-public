# 🚀 Cómo Crear el Frontend Angular

## ⚠️ Problema Detectado

PowerShell tiene restricciones de ejecución de scripts. Aquí están las soluciones:

---

## ✅ **SOLUCIÓN 1: Usar CMD en lugar de PowerShell**

### Paso 1: Abre CMD (no PowerShell)
```
Win + R → escribe "cmd" → Enter
```

### Paso 2: Navega al directorio
```cmd
cd D:\Github\luiscendan-private\luiscendan-private\personal\ProyectosFinales\FootballAnalyticsPro
```

### Paso 3: Crea el proyecto Angular
```cmd
npx @angular/cli@17 new football-analytics-frontend --routing --style=scss --standalone --skip-git
```

### Paso 4: Instala dependencias
```cmd
cd football-analytics-frontend
npm install
```

### Paso 5: Inicia el servidor
```cmd
ng serve
```

---

## ✅ **SOLUCIÓN 2: Habilitar Scripts en PowerShell (Como Administrador)**

### Paso 1: Abre PowerShell como Administrador
```
Win + X → "Windows PowerShell (Admin)"
```

### Paso 2: Ejecuta este comando
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Paso 3: Confirma con "Y"

### Paso 4: Ahora puedes usar PowerShell normalmente
```powershell
cd D:\Github\luiscendan-private\luiscendan-private\personal\ProyectosFinales\FootballAnalyticsPro
npx @angular/cli@17 new football-analytics-frontend --routing --style=scss --standalone --skip-git
```

---

## ✅ **SOLUCIÓN 3: Usar Git Bash**

Si tienes Git instalado:

```bash
cd /d/Github/luiscendan-private/luiscendan-private/personal/ProyectosFinales/FootballAnalyticsPro
npx @angular/cli@17 new football-analytics-frontend --routing --style=scss --standalone --skip-git
```

---

## 📋 **Estructura que se Creará**

```
FootballAnalyticsPro/
├── backend/                    # ✅ Ya existe
├── football-analytics-frontend/  # ⬅️ Nuevo
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── environments/
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── docs/
```

---

## 🎯 **Después de Crear el Proyecto**

### 1. Instalar dependencias adicionales
```bash
cd football-analytics-frontend
npm install @angular/material @angular/cdk
npm install apexcharts ng-apexcharts
npm install rxjs
```

### 2. Iniciar el servidor de desarrollo
```bash
ng serve
```

### 3. Abrir en el navegador
```
http://localhost:4200
```

---

## 🔧 **Si Prefieres Usar el Directorio `frontend` Existente**

### Opción A: Renombrar y crear nuevo
```cmd
cd D:\Github\luiscendan-private\luiscendan-private\personal\ProyectosFinales\FootballAnalyticsPro
rename frontend frontend-old
npx @angular/cli@17 new frontend --routing --style=scss --standalone --skip-git
```

### Opción B: Limpiar y crear en el mismo directorio
```cmd
cd D:\Github\luiscendan-private\luiscendan-private\personal\ProyectosFinales\FootballAnalyticsPro
rmdir /s /q frontend
npx @angular/cli@17 new frontend --routing --style=scss --standalone --skip-git
```

---

## 💡 **Recomendación**

**USA CMD (Solución 1)** - Es la más rápida y no requiere permisos de administrador.

1. Abre CMD
2. Navega al directorio del proyecto
3. Ejecuta: `npx @angular/cli@17 new football-analytics-frontend --routing --style=scss --standalone --skip-git`
4. Espera 2-3 minutos
5. ¡Listo!

---

## 🆘 **Si Sigue Sin Funcionar**

Prueba con la versión global de Angular CLI:

```cmd
npm install -g @angular/cli@17
ng new football-analytics-frontend --routing --style=scss --standalone --skip-git
```

---

## ✅ **Verificar que Funcionó**

Después de crear el proyecto, verifica:

```cmd
cd football-analytics-frontend
dir
```

Deberías ver:
- `src/`
- `angular.json`
- `package.json`
- `tsconfig.json`

---

**¡Usa CMD y funcionará!** 🚀
