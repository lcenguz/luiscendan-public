---
name: agent-framework-helper
description: Asistente para navegar y consultar el repositorio Microsoft Agent Framework. Ayuda a encontrar ejemplos, patrones de código y documentación relevante.
---

# Agent Framework Helper Skill

## Propósito

Este skill te ayuda a navegar y utilizar el repositorio **Microsoft Agent Framework** que está clonado localmente en:
```
c:\Github-Personal\luiscendan-private\agent-framework
```

## Recursos de Conocimiento Disponibles

Antes de explorar el repositorio directamente, **SIEMPRE consulta primero** estos documentos de referencia en `.agent/knowledge/`:

1. **[agent-framework-ref.md](file:///c:/Github-Personal/luiscendan-private/.agent/knowledge/agent-framework-ref.md)**
   - Conceptos principales del framework
   - Proveedores soportados
   - Características avanzadas
   - Casos de uso comunes

2. **[examples-index.md](file:///c:/Github-Personal/luiscendan-private/.agent/knowledge/examples-index.md)**
   - Índice categorizado de todos los ejemplos
   - Enlaces directos a archivos del repositorio
   - Recomendaciones de aprendizaje

3. **[quick-patterns.md](file:///c:/Github-Personal/luiscendan-private/.agent/knowledge/quick-patterns.md)**
   - Snippets de código listos para usar
   - Patrones comunes implementados
   - Tips y mejores prácticas

## Cuándo Usar Este Skill

Activa este skill cuando el usuario:
- Pregunte sobre cómo crear agentes de IA
- Necesite ejemplos de workflows o orquestación
- Quiera implementar tools/herramientas para agentes
- Busque información sobre proveedores (Azure OpenAI, OpenAI, Anthropic, etc.)
- Necesite patrones de human-in-the-loop
- Pregunte sobre checkpointing, middleware, observabilidad
- Quiera integrar MCP (Model Context Protocol)

## Instrucciones de Uso

### 1. Consulta Inicial - Documentación de Referencia

**SIEMPRE empieza aquí:**
- Lee `agent-framework-ref.md` para entender conceptos
- Consulta `examples-index.md` para encontrar ejemplos relevantes
- Usa `quick-patterns.md` para obtener código listo para usar

### 2. Explorar Ejemplos del Repositorio

Si necesitas ver el código fuente completo de un ejemplo:

```bash
# Ver un ejemplo específico
view_file c:\Github-Personal\luiscendan-private\agent-framework\python\samples\getting_started\agents\azure_openai\azure_responses_client_basic.py
```

### 3. Buscar en el Repositorio

Para buscar conceptos específicos:

```bash
# Buscar en el código
grep_search --path "c:\Github-Personal\luiscendan-private\agent-framework\python\samples" --query "approval_mode"

# Listar ejemplos de una categoría
list_dir c:\Github-Personal\luiscendan-private\agent-framework\python\samples\getting_started\workflows
```

### 4. Documentación Oficial

El framework tiene documentación completa en:
- **README principal**: `agent-framework/README.md`
- **Samples README**: `agent-framework/python/samples/README.md`
- **Workflows README**: `agent-framework/python/samples/getting_started/workflows/README.md`
- **FAQs**: `agent-framework/docs/FAQS.md`

## Categorías de Ejemplos

### Agentes por Proveedor
- **Azure OpenAI**: `python/samples/getting_started/agents/azure_openai/`
- **Azure AI (Foundry)**: `python/samples/getting_started/agents/azure_ai/`
- **OpenAI**: `python/samples/getting_started/agents/openai/`
- **Anthropic**: `python/samples/getting_started/agents/anthropic/`
- **Ollama**: `python/samples/getting_started/agents/ollama/`

### Workflows
- **Empezar aquí**: `python/samples/getting_started/workflows/_start-here/`
- **Control de flujo**: `python/samples/getting_started/workflows/control-flow/`
- **Paralelismo**: `python/samples/getting_started/workflows/parallelism/`
- **HITL**: `python/samples/getting_started/workflows/human-in-the-loop/`
- **Checkpointing**: `python/samples/getting_started/workflows/checkpoint/`

### Características Avanzadas
- **Tools**: `python/samples/getting_started/tools/`
- **Middleware**: `python/samples/getting_started/middleware/`
- **Observabilidad**: `python/samples/getting_started/observability/`
- **Context Providers**: `python/samples/getting_started/context_providers/`
- **MCP**: `python/samples/getting_started/mcp/`

## Flujo de Trabajo Recomendado

1. **Usuario pregunta sobre agentes/workflows**
   → Consulta `agent-framework-ref.md` para conceptos

2. **Usuario necesita un ejemplo**
   → Busca en `examples-index.md` el ejemplo más relevante
   → Proporciona el enlace directo al archivo

3. **Usuario quiere código**
   → Copia el snippet de `quick-patterns.md`
   → Adapta según las necesidades específicas

4. **Usuario necesita detalles**
   → Lee el archivo de ejemplo completo del repositorio
   → Explica el código línea por línea si es necesario

## Ejemplos de Uso

### Ejemplo 1: Usuario pregunta "¿Cómo creo un agente básico?"

**Respuesta:**
1. Consulta `quick-patterns.md` sección "Agentes Básicos"
2. Proporciona el snippet de código
3. Menciona el ejemplo completo en `examples-index.md`

### Ejemplo 2: Usuario pregunta "¿Cómo implemento human-in-the-loop?"

**Respuesta:**
1. Explica el concepto desde `agent-framework-ref.md`
2. Muestra el patrón de `quick-patterns.md` (tool con approval_mode)
3. Referencia ejemplos específicos de `examples-index.md`:
   - `tools/function_tool_with_approval.py`
   - `workflows/human-in-the-loop/guessing_game_with_human_input.py`

### Ejemplo 3: Usuario pregunta "¿Qué proveedores soporta?"

**Respuesta:**
1. Consulta la tabla de proveedores en `agent-framework-ref.md`
2. Proporciona enlaces a ejemplos de cada proveedor desde `examples-index.md`

## Tips Importantes

- **Siempre empieza con la documentación de referencia** antes de explorar el código
- **Usa enlaces directos** a archivos cuando sea posible (formato `file:///...`)
- **Proporciona código funcional** adaptado de `quick-patterns.md`
- **Menciona las mejores prácticas** (approval modes, observabilidad, etc.)
- **Recomienda la ruta de aprendizaje** del `examples-index.md` para principiantes

## Comandos Útiles

```bash
# Ver estructura de samples
list_dir c:\Github-Personal\luiscendan-private\agent-framework\python\samples\getting_started

# Buscar un concepto
grep_search --path "c:\Github-Personal\luiscendan-private\agent-framework" --query "checkpoint"

# Ver README de workflows
view_file c:\Github-Personal\luiscendan-private\agent-framework\python\samples\getting_started\workflows\README.md
```

## Notas Finales

Este skill está diseñado para hacer que el aprendizaje del Agent Framework sea **rápido y eficiente**. Siempre prioriza:
1. Documentación de referencia (`.agent/knowledge/`)
2. Ejemplos categorizados
3. Código funcional listo para usar
4. Exploración profunda del repositorio solo cuando sea necesario
