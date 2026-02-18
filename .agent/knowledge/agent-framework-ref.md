# Microsoft Agent Framework - Referencia Rápida

## 📋 Visión General

El **Microsoft Agent Framework** es un framework multi-lenguaje (Python y .NET) para construir, orquestar y desplegar agentes de IA, desde chatbots simples hasta workflows complejos multi-agente.

**Repositorio local**: `c:\Github-Personal\luiscendan-private\agent-framework`

## 🎯 Conceptos Principales

### 1. **Agents (Agentes)**
Los agentes son entidades de IA que pueden:
- Procesar mensajes de chat
- Usar herramientas (tools)
- Mantener contexto conversacional (threads)
- Generar respuestas estructuradas

### 2. **Chat Clients**
Clientes que se conectan a diferentes proveedores de LLM:
- `AzureOpenAIResponsesClient` - Azure OpenAI con respuestas estructuradas
- `OpenAIResponsesClient` - OpenAI directo
- `AzureAIClient` - Azure AI Foundry
- `AnthropicClient` - Claude
- `OllamaChatClient` - Modelos locales con Ollama

### 3. **Tools (Herramientas)**
Funciones que los agentes pueden invocar:
```python
from agent_framework import tool

@tool(approval_mode="always_require")  # Requiere aprobación humana
def get_weather(location: str) -> str:
    """Get the weather for a given location."""
    return f"Weather in {location}: sunny"
```

### 4. **Workflows**
Orquestación de múltiples agentes y funciones:
- **Sequential**: Agentes ejecutados en secuencia
- **Concurrent**: Agentes ejecutados en paralelo (fan-out/fan-in)
- **GroupChat**: Múltiples agentes conversando entre sí
- **Handoff**: Transferencia de control entre agentes
- **Magentic**: Orquestación basada en LLM

### 5. **Threads (Hilos de Conversación)**
Mantienen el historial de mensajes entre múltiples interacciones:
```python
thread = agent.create_thread()
await agent.run("Hello", thread=thread)
await agent.run("Continue conversation", thread=thread)
```

### 6. **Middleware**
Sistema de interceptores para procesar requests/responses:
- Logging
- Autenticación
- Manejo de excepciones
- Modificación de contexto

### 7. **Context Providers**
Almacenamiento de contexto conversacional:
- **Mem0**: Memoria a largo plazo
- **Redis**: Almacenamiento distribuido
- **Custom**: Implementaciones personalizadas

## 🚀 Patrones Comunes

### Crear un Agente Básico
```python
from agent_framework.azure import AzureOpenAIResponsesClient
from azure.identity import AzureCliCredential

agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    name="MyAgent",
    instructions="You are a helpful assistant."
)

result = await agent.run("Hello!")
```

### Agente con Tools
```python
@tool(approval_mode="never_require")
def calculate(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    instructions="You are a math assistant.",
    tools=[calculate]
)
```

### Streaming
```python
async for chunk in agent.run("Tell me a story", stream=True):
    if chunk.text:
        print(chunk.text, end="", flush=True)
```

## 📚 Proveedores Soportados

| Proveedor | Cliente | Características |
|-----------|---------|-----------------|
| Azure OpenAI | `AzureOpenAIResponsesClient` | Respuestas estructuradas, streaming |
| Azure AI | `AzureAIClient` | File search, code interpreter, Bing grounding |
| OpenAI | `OpenAIResponsesClient` | GPT-4, GPT-4o, streaming |
| Anthropic | `AnthropicClient` | Claude, thinking mode |
| Ollama | `OllamaChatClient` | Modelos locales, multimodal |
| Copilot Studio | `CopilotStudioClient` | Integración con Power Platform |

## 🔧 Características Avanzadas

### Human-in-the-Loop (HITL)
```python
# En workflows
result = await ctx.request_info("¿Aprobar esta acción?")

# En tools
@tool(approval_mode="always_require")
def sensitive_action():
    pass
```

### Checkpointing
```python
# Guardar estado del workflow
checkpoint = await workflow.run(input_data, checkpoint_storage=storage)

# Resumir desde checkpoint
result = await workflow.resume(checkpoint_id, storage)
```

### Observabilidad
```python
from agent_framework.observability import configure_otel_providers

configure_otel_providers(
    endpoint="http://localhost:4318",
    service_name="my-agent"
)
```

### MCP (Model Context Protocol)
```python
# Usar servidor MCP
agent = AzureOpenAIResponsesClient().as_agent(
    tools=mcp_server("https://api.example.com/mcp")
)
```

## 📁 Estructura del Repositorio

```
agent-framework/
├── python/
│   ├── packages/          # Paquetes del framework
│   └── samples/
│       └── getting_started/
│           ├── agents/    # Ejemplos de agentes
│           ├── workflows/ # Ejemplos de workflows
│           ├── tools/     # Ejemplos de herramientas
│           ├── middleware/# Ejemplos de middleware
│           └── observability/
├── dotnet/
│   ├── src/              # Código fuente .NET
│   └── samples/          # Ejemplos .NET
└── docs/
    ├── design/           # Documentos de diseño
    └── decisions/        # Decisiones arquitectónicas
```

## 🔗 Enlaces Útiles

- **Documentación oficial**: https://learn.microsoft.com/agent-framework/
- **Ejemplos Python**: `agent-framework/python/samples/getting_started/`
- **Índice de ejemplos**: Ver [examples-index.md](./examples-index.md)
- **Patrones de código**: Ver [quick-patterns.md](./quick-patterns.md)

## 💡 Casos de Uso

1. **Chatbots con herramientas**: Agentes que pueden buscar información, hacer cálculos, etc.
2. **Workflows multi-agente**: Orquestar especialistas (research, writing, review)
3. **Asistentes empresariales**: Integración con Azure AI Search, Microsoft Fabric
4. **Agentes con memoria**: Context providers para recordar conversaciones previas
5. **Pipelines de procesamiento**: Workflows secuenciales/paralelos con checkpointing
