# Football Analytics Pro - Start Script
# Este script inicia el backend y el frontend automáticamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Football Analytics Pro - Iniciando..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Java está instalado
Write-Host "Verificando Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java encontrado: $javaVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Java no encontrado. Por favor instala Java 17 o superior." -ForegroundColor Red
    exit 1
}

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Node.js no encontrado. Por favor instala Node.js 18 o superior." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Backend (Spring Boot)..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Iniciar backend en una nueva ventana de PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Iniciando Backend...' -ForegroundColor Green; .\mvnw spring-boot:run"

Write-Host "✓ Backend iniciado en http://localhost:8080" -ForegroundColor Green
Write-Host ""

# Esperar 10 segundos para que el backend inicie
Write-Host "Esperando 10 segundos para que el backend inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Frontend (Angular)..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Verificar si node_modules existe
if (-Not (Test-Path "$PSScriptRoot\frontend\node_modules")) {
    Write-Host "node_modules no encontrado. Instalando dependencias..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm install; ng serve --open"
}
else {
    # Iniciar frontend en una nueva ventana de PowerShell
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Iniciando Frontend...' -ForegroundColor Green; ng serve --open"
}

Write-Host "✓ Frontend iniciado en http://localhost:4200" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ¡Aplicación Iniciada!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C en cada ventana para detener los servicios." -ForegroundColor Gray
Write-Host ""
