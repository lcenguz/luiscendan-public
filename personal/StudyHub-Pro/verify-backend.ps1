# Script de verificacion para StudyHub Pro Backend
Write-Host "Verificando StudyHub Pro Backend..." -ForegroundColor Cyan
Write-Host ""

# Navegar al directorio del backend
Set-Location -Path "$PSScriptRoot\backend"

# Verificar Maven
Write-Host "Verificando Maven..." -ForegroundColor Yellow
$mavenVersion = mvn -version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Maven instalado correctamente" -ForegroundColor Green
    $mavenVersion | Select-String "Apache Maven" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
}
else {
    Write-Host "Maven no encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar Java
Write-Host "Verificando Java..." -ForegroundColor Yellow
$javaVersion = java -version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Java instalado correctamente" -ForegroundColor Green
    $javaVersion | Select-String "version" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
}
else {
    Write-Host "Java no encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar procesos Java corriendo
Write-Host "Verificando procesos Java..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Hay $($javaProcesses.Count) proceso(s) Java corriendo" -ForegroundColor Yellow
    $javaProcesses | ForEach-Object { 
        Write-Host "   PID: $($_.Id) - Memoria: $([math]::Round($_.WorkingSet64/1MB, 2)) MB" -ForegroundColor Gray 
    }
}
else {
    Write-Host "No hay procesos Java corriendo" -ForegroundColor Green
}

Write-Host ""

# Compilar sin ejecutar
Write-Host "Compilando proyecto (sin ejecutar)..." -ForegroundColor Yellow
mvn clean compile -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilacion exitosa" -ForegroundColor Green
}
else {
    Write-Host "Error en la compilacion" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resumen de configuracion:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend URL: http://localhost:8080" -ForegroundColor White
Write-Host "  H2 Console: http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "  JDBC URL: jdbc:h2:mem:studyhub" -ForegroundColor White
Write-Host "  Base de datos: H2 (memoria)" -ForegroundColor White
Write-Host "  Proveedor IA: Gemini" -ForegroundColor White
Write-Host ""
Write-Host "Para iniciar el backend, ejecuta:" -ForegroundColor Yellow
Write-Host "  .\start-backend.ps1" -ForegroundColor Green
Write-Host ""
