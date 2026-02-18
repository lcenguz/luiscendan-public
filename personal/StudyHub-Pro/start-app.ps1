# Script para abrir StudyHub Pro (Version Serverless)
Write-Host "Abriendo StudyHub Pro..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Version: Serverless (Sin Backend)" -ForegroundColor Green
Write-Host "No se requiere Java ni Maven" -ForegroundColor Green
Write-Host ""

# Obtener la ruta del archivo HTML
$htmlPath = Join-Path $PSScriptRoot "index.html"

# Verificar que existe
if (Test-Path $htmlPath) {
    Write-Host "Abriendo en tu navegador predeterminado..." -ForegroundColor Yellow
    Start-Process $htmlPath
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "StudyHub Pro - Guia Rapida" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Configura tu IA:" -ForegroundColor White
    Write-Host "   - Ve a Configuracion (icono de engranaje)" -ForegroundColor Gray
    Write-Host "   - Pega tu API key de Gemini, OpenAI o Claude" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Obtener API Keys GRATIS:" -ForegroundColor White
    Write-Host "   - Gemini: https://makersuite.google.com/app/apikey" -ForegroundColor Gray
    Write-Host "   - OpenAI: https://platform.openai.com/api-keys" -ForegroundColor Gray
    Write-Host "   - Claude: https://console.anthropic.com/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Funciona sin configurar IA:" -ForegroundColor White
    Write-Host "   - Crear notas" -ForegroundColor Gray
    Write-Host "   - Gestionar tareas" -ForegroundColor Gray
    Write-Host "   - Subir archivos" -ForegroundColor Gray
    Write-Host "   - Ver calendario" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Mas info: README_SERVERLESS.md" -ForegroundColor Yellow
    Write-Host ""
}
else {
    Write-Host "Error: No se encontro index.html" -ForegroundColor Red
    Write-Host "Asegurate de estar en la carpeta correcta" -ForegroundColor Red
}
