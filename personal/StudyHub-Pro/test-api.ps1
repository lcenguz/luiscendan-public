# ===================================
# SCRIPT DE PRUEBA - STUDYHUB PRO API
# ===================================
# Este script prueba todos los endpoints del backend

$baseUrl = "http://localhost:8080/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROBANDO STUDYHUB PRO API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Función para hacer peticiones
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host "🔍 $Description" -ForegroundColor Yellow
    Write-Host "   $Method $Endpoint" -ForegroundColor Gray
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Body $Body -ContentType "application/json"
        }
        else {
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method
        }
        
        Write-Host "   ✅ SUCCESS" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor White
    }
    catch {
        Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# ===== PROBAR NOTAS =====
Write-Host "📝 PROBANDO ENDPOINTS DE NOTAS" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

Test-Endpoint -Method "GET" -Endpoint "/notes" -Description "Obtener todas las notas"

$noteBody = @{
    title   = "Mi primera nota de prueba"
    content = "Este es el contenido de la nota de prueba. ¡El backend funciona!"
    subject = "Programación"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/notes" -Body $noteBody -Description "Crear nueva nota"

Test-Endpoint -Method "GET" -Endpoint "/notes?subject=Programación" -Description "Filtrar notas por asignatura"

# ===== PROBAR TAREAS =====
Write-Host "📅 PROBANDO ENDPOINTS DE TAREAS" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

Test-Endpoint -Method "GET" -Endpoint "/tasks" -Description "Obtener todas las tareas"

$taskBody = @{
    title       = "Estudiar para el examen"
    description = "Repasar los temas 1-5"
    priority    = "HIGH"
    dueDate     = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss")
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/tasks" -Body $taskBody -Description "Crear nueva tarea"

Test-Endpoint -Method "GET" -Endpoint "/tasks/stats" -Description "Obtener estadísticas de tareas"

# ===== PROBAR IA (si está configurada) =====
Write-Host "🤖 PROBANDO ENDPOINTS DE IA" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

Write-Host "⚠️  NOTA: Estos endpoints requieren API key configurada" -ForegroundColor Yellow
Write-Host ""

$aiBody = @{
    query            = "¿Qué es una derivada en matemáticas?"
    provider         = "openai"
    subject          = "matemáticas"
    studentLevel     = "básico"
    firstInteraction = $true
    needsExamples    = $true
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/ai/chat" -Body $aiBody -Description "Enviar mensaje a IA (requiere API key)"

Test-Endpoint -Method "GET" -Endpoint "/ai/stats" -Description "Obtener estadísticas de IA"

# ===== RESUMEN =====
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Si ves respuestas JSON arriba, el backend funciona correctamente" -ForegroundColor Green
Write-Host "⚠️  Para usar IA, configura tu API key en application.properties" -ForegroundColor Yellow
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Configura tu API key de IA" -ForegroundColor White
Write-Host "  2. Crea el frontend Angular" -ForegroundColor White
Write-Host "  3. Conecta frontend con backend" -ForegroundColor White
Write-Host ""
