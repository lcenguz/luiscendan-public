# Índice de Ejemplos - Microsoft Agent Framework

Este documento indexa los ejemplos más relevantes del repositorio local para facilitar el aprendizaje.

**Ruta base**: `c:\Github-Personal\luiscendan-private\agent-framework\python\samples\getting_started\`

## 🚀 Empezar Aquí

### Ejemplos Básicos de Agentes

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Agente básico Azure OpenAI** | [`agents/azure_openai/azure_responses_client_basic.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_openai/azure_responses_client_basic.py) | Agente simple con streaming y no-streaming |
| **Agente con herramientas** | [`agents/azure_openai/azure_responses_client_with_function_tools.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_openai/azure_responses_client_with_function_tools.py) | Agente que usa function tools |
| **Agente con threads** | [`agents/azure_openai/azure_responses_client_with_thread.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_openai/azure_responses_client_with_thread.py) | Mantener historial conversacional |

### Ejemplos Básicos de Workflows

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Executors y Edges** | [`workflows/_start-here/step1_executors_and_edges.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/_start-here/step1_executors_and_edges.py) | Conceptos fundamentales de workflows |
| **Agentes en Workflows** | [`workflows/_start-here/step2_agents_in_a_workflow.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/_start-here/step2_agents_in_a_workflow.py) | Integrar agentes en workflows |
| **Streaming en Workflows** | [`workflows/_start-here/step3_streaming.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/_start-here/step3_streaming.py) | Event streaming en workflows |

## 📂 Por Categoría

### 1. Agentes por Proveedor

#### Azure OpenAI
- **Básico**: [`agents/azure_openai/azure_responses_client_basic.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_openai/azure_responses_client_basic.py)
- **Con Code Interpreter**: [`agents/azure_openai/azure_responses_client_with_code_interpreter.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_openai/azure_responses_client_with_code_interpreter.py)
- **Con MCP local**: [`agents/azure_openai/azure_responses_client_with_local_mcp.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_openai/azure_responses_client_with_local_mcp.py)
- **Análisis de imágenes**: [`agents/azure_openai/azure_responses_client_image_analysis.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_openai/azure_responses_client_image_analysis.py)

#### Azure AI (Foundry)
- **Básico**: [`agents/azure_ai/azure_ai_basic.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_ai/azure_ai_basic.py)
- **Con Azure AI Search**: [`agents/azure_ai/azure_ai_with_azure_ai_search.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_ai/azure_ai_with_azure_ai_search.py)
- **Con Bing Grounding**: [`agents/azure_ai/azure_ai_with_bing_grounding.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_ai/azure_ai_with_bing_grounding.py)
- **Con File Search**: [`agents/azure_ai/azure_ai_with_file_search.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/azure_ai/azure_ai_with_file_search.py)

#### OpenAI
- **Básico**: [`agents/openai/openai_responses_client_basic.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/openai/openai_responses_client_basic.py)
- **Con Reasoning (o1)**: [`agents/openai/openai_responses_client_reasoning.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/openai/openai_responses_client_reasoning.py)
- **Generación de imágenes**: [`agents/openai/openai_responses_client_image_generation.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/openai/openai_responses_client_image_generation.py)

#### Anthropic (Claude)
- **Básico**: [`agents/anthropic/anthropic_basic.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/anthropic/anthropic_basic.py)
- **Avanzado con thinking**: [`agents/anthropic/anthropic_advanced.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/anthropic/anthropic_advanced.py)

#### Ollama (Local)
- **Básico**: [`agents/ollama/ollama_agent_basic.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/ollama/ollama_agent_basic.py)
- **Con reasoning**: [`agents/ollama/ollama_agent_reasoning.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/ollama/ollama_agent_reasoning.py)
- **Multimodal**: [`agents/ollama/ollama_chat_multimodal.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/agents/ollama/ollama_chat_multimodal.py)

### 2. Tools (Herramientas)

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Tool con aprobación** | [`tools/function_tool_with_approval.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/tools/function_tool_with_approval.py) | Human-in-the-loop para tools |
| **Tool con threads** | [`tools/function_tool_with_approval_and_threads.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/tools/function_tool_with_approval_and_threads.py) | Aprobación con historial |
| **Manejo de errores** | [`tools/function_tool_recover_from_failures.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/tools/function_tool_recover_from_failures.py) | Recuperación de fallos |
| **Tools en clases** | [`tools/tool_in_class.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/tools/tool_in_class.py) | Tools con estado |

### 3. Workflows - Control de Flujo

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Sequential** | [`workflows/control-flow/sequential_executors.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/control-flow/sequential_executors.py) | Ejecución secuencial |
| **Conditional routing** | [`workflows/control-flow/edge_condition.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/control-flow/edge_condition.py) | Routing condicional |
| **Switch-case** | [`workflows/control-flow/switch_case_edge_group.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/control-flow/switch_case_edge_group.py) | Branching tipo switch |
| **Loops** | [`workflows/control-flow/simple_loop.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/control-flow/simple_loop.py) | Feedback loops |

### 4. Workflows - Paralelismo

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Fan-out/Fan-in** | [`workflows/parallelism/fan_out_fan_in_edges.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/parallelism/fan_out_fan_in_edges.py) | Ejecución paralela |
| **Map-Reduce** | [`workflows/parallelism/map_reduce_and_visualization.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/parallelism/map_reduce_and_visualization.py) | Patrón map-reduce |

### 5. Workflows - Human-in-the-Loop

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Guessing game** | [`workflows/human-in-the-loop/guessing_game_with_human_input.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/human-in-the-loop/guessing_game_with_human_input.py) | Input interactivo |
| **Approval requests** | [`workflows/human-in-the-loop/agents_with_approval_requests.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/human-in-the-loop/agents_with_approval_requests.py) | Aprobaciones en workflows |

### 6. Workflows - Checkpointing

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Checkpoint básico** | [`workflows/checkpoint/checkpoint_with_resume.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/checkpoint/checkpoint_with_resume.py) | Guardar y resumir estado |
| **Checkpoint + HITL** | [`workflows/checkpoint/checkpoint_with_human_in_the_loop.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/checkpoint/checkpoint_with_human_in_the_loop.py) | Checkpoints con aprobaciones |

### 7. Middleware

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Function-based** | [`middleware/function_based_middleware.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/middleware/function_based_middleware.py) | Middleware con funciones |
| **Class-based** | [`middleware/class_based_middleware.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/middleware/class_based_middleware.py) | Middleware con clases |
| **Exception handling** | [`middleware/exception_handling_with_middleware.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/middleware/exception_handling_with_middleware.py) | Manejo de errores |

### 8. Observabilidad

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Observabilidad básica** | [`observability/agent_observability.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/observability/agent_observability.py) | OpenTelemetry básico |
| **Azure Foundry tracing** | [`observability/agent_with_foundry_tracing.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/observability/agent_with_foundry_tracing.py) | Tracing en Azure |
| **Workflow observability** | [`observability/workflow_observability.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/observability/workflow_observability.py) | Observar workflows |

### 9. Context Providers

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Mem0 básico** | [`context_providers/mem0/mem0_basic.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/context_providers/mem0/mem0_basic.py) | Memoria a largo plazo |
| **Redis básico** | [`context_providers/redis/redis_basics.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/context_providers/redis/redis_basics.py) | Context con Redis |

### 10. Declarative (YAML)

| Ejemplo | Ruta | Descripción |
|---------|------|-------------|
| **Agente desde YAML** | [`declarative/azure_openai_responses_agent.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/declarative/azure_openai_responses_agent.py) | Definición declarativa |
| **Inline YAML** | [`declarative/inline_yaml.py`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/declarative/inline_yaml.py) | YAML inline |

## 📖 Documentación Adicional

- **README completo de samples**: [`python/samples/README.md`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/README.md)
- **Workflows README**: [`python/samples/getting_started/workflows/README.md`](file:///c:/Github-Personal/luiscendan-private/agent-framework/python/samples/getting_started/workflows/README.md)
- **FAQs**: [`docs/FAQS.md`](file:///c:/Github-Personal/luiscendan-private/agent-framework/docs/FAQS.md)

## 🎯 Recomendaciones de Aprendizaje

1. **Día 1**: Empezar con agentes básicos (Azure OpenAI o OpenAI)
2. **Día 2**: Agregar tools y explorar approval modes
3. **Día 3**: Workflows básicos (sequential, concurrent)
4. **Día 4**: Human-in-the-loop y checkpointing
5. **Día 5**: Middleware y observabilidad
6. **Día 6**: Context providers y memoria
7. **Día 7**: Workflows avanzados y orquestación
