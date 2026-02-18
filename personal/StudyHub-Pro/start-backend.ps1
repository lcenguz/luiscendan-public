# Script de inicio para StudyHub Pro Backend
Write-Host "Iniciando StudyHub Pro Backend..." -ForegroundColor Cyan

# Navegar al directorio del backend
Set-Location -Path "$PSScriptRoot\backend"

# Verificar si hay procesos Java corriendo
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Detectados procesos Java corriendo. Deseas cerrarlos? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "S" -or $response -eq "s") {
        Stop-Process -Name "java" -Force
        Write-Host "Procesos Java cerrados" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

# Compilar y ejecutar
Write-Host "Compilando proyecto..." -ForegroundColor Cyan
mvn clean compile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilacion exitosa" -ForegroundColor Green
    Write-Host "Iniciando servidor..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend disponible en: http://localhost:8080" -ForegroundColor Green
    Write-Host "Consola H2 disponible en: http://localhost:8080/h2-console" -ForegroundColor Green
    Write-Host "  - JDBC URL: jdbc:h2:mem:studyhub" -ForegroundColor Gray
    Write-Host "  - Usuario: sa" -ForegroundColor Gray
    Write-Host "  - Password: (vacio)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
    Write-Host ""
    
    mvn spring-boot:run
}
else {
    Write-Host "Error en la compilacion" -ForegroundColor Red
    exit 1
}
