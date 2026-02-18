# Patrones de Código Rápidos - Agent Framework

Snippets de código listos para usar basados en los ejemplos del framework.

## 🎯 Agentes Básicos

### Agente Simple (Azure OpenAI)
```python
from agent_framework.azure import AzureOpenAIResponsesClient
from azure.identity import AzureCliCredential

# Autenticación con Azure CLI (requiere 'az login')
agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    name="MyAssistant",
    instructions="You are a helpful assistant."
)

# Ejecución simple
result = await agent.run("Hello, how are you?")
print(result)
```

### Agente con Streaming
```python
# Streaming de respuestas
async for chunk in agent.run("Tell me a story", stream=True):
    if chunk.text:
        print(chunk.text, end="", flush=True)
```

### Agente con Configuración Explícita
```python
agent = AzureOpenAIResponsesClient(
    endpoint="https://your-resource.openai.azure.com",
    deployment_name="gpt-4o",
    api_version="2024-10-01-preview",
    credential=AzureCliCredential()
).as_agent(
    name="ConfiguredAgent",
    instructions="You are an expert assistant.",
    temperature=0.7,
    max_tokens=1000
)
```

## 🛠️ Tools (Herramientas)

### Tool Básico
```python
from agent_framework import tool
from typing import Annotated
from pydantic import Field

@tool(approval_mode="never_require")  # Para producción: "always_require"
def get_weather(
    location: Annotated[str, Field(description="City name")]
) -> str:
    """Get current weather for a location."""
    # Tu lógica aquí
    return f"Weather in {location}: sunny, 22°C"

# Usar con agente
agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    instructions="You are a weather assistant.",
    tools=[get_weather]
)
```

### Tool con Aprobación (HITL)
```python
@tool(approval_mode="always_require")
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email (requires approval)."""
    # Esta función requiere aprobación humana antes de ejecutarse
    return f"Email sent to {to}"

# Manejar aprobaciones
result = await agent.run("Send email to john@example.com")
if result.approval_requests:
    for request in result.approval_requests:
        # Aprobar o rechazar
        request.approve()  # o request.reject("Reason")
```

### Tool en Clase (con Estado)
```python
class Calculator:
    def __init__(self):
        self.history = []
    
    @tool(approval_mode="never_require")
    def add(self, a: int, b: int) -> int:
        """Add two numbers."""
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

calc = Calculator()
agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(tools=[calc.add])
```

## 🧵 Threads (Historial Conversacional)

### Thread Básico
```python
# Crear thread
thread = agent.create_thread()

# Múltiples interacciones con mismo contexto
await agent.run("My name is Alice", thread=thread)
await agent.run("What's my name?", thread=thread)  # Recordará "Alice"
```

### Thread con Almacenamiento Persistente
```python
from agent_framework.context_providers import RedisChatMessageStore

# Configurar Redis
store = RedisChatMessageStore(
    redis_url="redis://localhost:6379"
)

# Crear thread con almacenamiento
thread = agent.create_thread(message_store=store)
```

## 🔄 Workflows

### Sequential Workflow
```python
from agent_framework.workflows import SequentialBuilder

# Crear agentes especializados
researcher = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    name="Researcher",
    instructions="Research topics thoroughly."
)

writer = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    name="Writer",
    instructions="Write clear, engaging content."
)

# Workflow secuencial
workflow = SequentialBuilder() \
    .add_agent(researcher) \
    .add_agent(writer) \
    .build()

# Ejecutar
result = await workflow.run("Write about AI agents")
```

### Concurrent Workflow (Fan-out/Fan-in)
```python
from agent_framework.workflows import ConcurrentBuilder

# Múltiples agentes en paralelo
workflow = ConcurrentBuilder() \
    .add_agent(researcher) \
    .add_agent(writer) \
    .add_agent(reviewer) \
    .build()

# Todos ejecutan en paralelo
result = await workflow.run("Analyze this topic")
```

### Workflow con Conditional Routing
```python
from agent_framework.workflows import Workflow, Edge

# Clasificador
classifier = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    name="Classifier",
    instructions="Classify as 'technical' or 'general'"
)

# Handlers especializados
technical_agent = ...
general_agent = ...

# Workflow con routing
workflow = Workflow()
workflow.add_edge(Edge(
    source=classifier,
    target=technical_agent,
    condition=lambda x: "technical" in x.lower()
))
workflow.add_edge(Edge(
    source=classifier,
    target=general_agent,
    condition=lambda x: "general" in x.lower()
))
```

### Workflow con Human-in-the-Loop
```python
from agent_framework.workflows import SequentialBuilder

async def review_step(ctx, input_data):
    # Solicitar aprobación humana
    approval = await ctx.request_info(
        f"Review this output: {input_data}\nApprove? (yes/no)"
    )
    return approval

workflow = SequentialBuilder() \
    .add_agent(writer) \
    .add_executor(review_step) \
    .build()
```

### Workflow con Checkpointing
```python
from agent_framework.workflows import CheckpointStorage

# Configurar almacenamiento de checkpoints
storage = CheckpointStorage(path="./checkpoints")

# Ejecutar con checkpointing
checkpoint = await workflow.run(
    input_data,
    checkpoint_storage=storage
)

# Resumir desde checkpoint
result = await workflow.resume(
    checkpoint_id=checkpoint.id,
    storage=storage
)
```

## 🎛️ Middleware

### Middleware de Logging
```python
from agent_framework.middleware import Middleware

class LoggingMiddleware(Middleware):
    async def on_request(self, ctx, next_handler):
        print(f"Request: {ctx.request}")
        result = await next_handler(ctx)
        print(f"Response: {result}")
        return result

# Aplicar middleware
agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    middleware=[LoggingMiddleware()]
)
```

### Middleware de Autenticación
```python
class AuthMiddleware(Middleware):
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def on_request(self, ctx, next_handler):
        # Validar autenticación
        if ctx.headers.get("Authorization") != f"Bearer {self.api_key}":
            raise ValueError("Unauthorized")
        return await next_handler(ctx)
```

## 📊 Observabilidad

### Configuración Básica de OpenTelemetry
```python
from agent_framework.observability import configure_otel_providers

# Configurar exportadores
configure_otel_providers(
    endpoint="http://localhost:4318",  # OTLP endpoint
    service_name="my-agent-service",
    enable_console_export=True  # Para debugging
)

# Ahora todos los agentes están instrumentados
agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(name="TracedAgent")
```

### Observabilidad con Azure Foundry
```python
from agent_framework.observability import configure_foundry_tracing

configure_foundry_tracing(
    project_connection_string="your-connection-string"
)
```

## 🧠 Context Providers

### Mem0 (Memoria a Largo Plazo)
```python
from agent_framework.context_providers import Mem0ContextProvider

# Configurar Mem0
context_provider = Mem0ContextProvider(
    api_key="your-mem0-api-key",
    user_id="user123"
)

agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(
    context_provider=context_provider
)

# El agente ahora recuerda entre sesiones
```

### Redis Context Provider
```python
from agent_framework.context_providers import RedisContextProvider

context_provider = RedisContextProvider(
    redis_url="redis://localhost:6379",
    ttl=3600  # 1 hora
)
```

## 🔌 MCP (Model Context Protocol)

### Usar Servidor MCP
```python
from agent_framework.mcp import mcp_server

# Conectar a servidor MCP
tools = mcp_server("https://api.example.com/mcp")

agent = AzureOpenAIResponsesClient(
    credential=AzureCliCredential()
).as_agent(tools=tools)
```

### Agente como Servidor MCP
```python
from agent_framework.mcp import serve_as_mcp

# Exponer agente como servidor MCP
await serve_as_mcp(
    agent=agent,
    host="0.0.0.0",
    port=8080
)
```

## 📝 Declarative (YAML)

### Agente desde YAML
```python
from agent_framework.declarative import load_agent_from_yaml

yaml_config = """
name: MyAgent
instructions: You are a helpful assistant
provider:
  type: azure_openai
  deployment: gpt-4o
tools:
  - name: get_weather
    type: function
"""

agent = load_agent_from_yaml(yaml_config)
```

## 🎨 Patrones Avanzados

### Workflow as Agent (Reutilizable)
```python
# Crear workflow complejo
complex_workflow = SequentialBuilder() \
    .add_agent(researcher) \
    .add_agent(writer) \
    .add_agent(reviewer) \
    .build()

# Convertir a agente reutilizable
workflow_agent = complex_workflow.as_agent(
    name="ResearchWriteReview",
    instructions="Research, write, and review content"
)

# Usar como cualquier otro agente
result = await workflow_agent.run("Topic to research")
```

### Multi-Agent con Handoff
```python
from agent_framework.workflows import HandoffBuilder

workflow = HandoffBuilder() \
    .add_agent(support_agent) \
    .add_agent(technical_agent) \
    .add_agent(billing_agent) \
    .build()

# Los agentes pueden transferirse entre sí
result = await workflow.run("I have a billing question")
```

## 💡 Tips de Uso

1. **Approval modes**: Usa `"always_require"` en producción para tools sensibles
2. **Streaming**: Ideal para UX responsiva en aplicaciones interactivas
3. **Threads**: Esencial para mantener contexto conversacional
4. **Checkpointing**: Crítico para workflows largos que pueden fallar
5. **Middleware**: Perfecto para logging, auth, rate limiting
6. **Observabilidad**: Configura desde el inicio para debugging efectivo
