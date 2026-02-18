---
name: healthcare-ai-evaluator
description: Herramientas y guías para evaluación de modelos de IA médica usando métricas estándar (ROUGE, BERTScore, TBFact) y model-as-judge evaluations.
---

# Healthcare AI Evaluator Skill

## Propósito

Este skill proporciona herramientas y guías para **evaluar modelos de IA médica** usando el framework **Microsoft Healthcare AI Model Evaluator**. Incluye métricas automáticas, evaluación basada en LLM (model-as-judge), y workflows de validación clínica.

**Repositorio fuente**: `c:\Github-Personal\luiscendan-private\healthcare-ai-model-evaluator`

## Cuándo Usar Este Skill

Activa este skill cuando el usuario:
- Necesite evaluar modelos de IA para aplicaciones médicas
- Quiera calcular métricas de benchmarking (ROUGE, BERTScore, TBFact)
- Busque implementar model-as-judge evaluations
- Necesite validar outputs de modelos médicos
- Quiera comparar múltiples modelos (A/B testing)
- Requiera workflows de revisión por expertos clínicos

## 🎯 Capacidades Principales

### 1. Métricas Automáticas

#### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)
- **Uso**: Evaluar resúmenes médicos, generación de reportes
- **Métricas**: ROUGE-1, ROUGE-2, ROUGE-L
- **Qué mide**: Overlap de n-gramas entre texto generado y referencia

#### BERTScore
- **Uso**: Evaluación semántica de textos médicos
- **Qué mide**: Similitud semántica usando embeddings contextuales
- **Ventaja**: Captura paráfrasis y sinónimos mejor que ROUGE

#### TBFact (Factual Consistency)
- **Uso**: Verificar consistencia factual en resúmenes médicos
- **Qué mide**: Si el resumen contiene información factualmente correcta
- **Crítico para**: Aplicaciones clínicas donde la precisión es vital

#### Exact Match
- **Uso**: Tareas de clasificación (diagnóstico, categorización)
- **Qué mide**: Coincidencia exacta entre predicción y ground truth

### 2. Model-as-Judge

Evaluación basada en LLM (Azure OpenAI) para métricas subjetivas:
- **Claridad**: ¿El texto es claro y comprensible?
- **Completitud**: ¿Incluye toda la información relevante?
- **Precisión clínica**: ¿Es médicamente preciso?
- **Relevancia**: ¿Es relevante para el contexto clínico?

### 3. Workflows de Validación

- **Expert Review**: Validación por profesionales médicos
- **Multi-Reviewer**: Combinación de evaluadores humanos y AI
- **A/B Testing**: Comparación de múltiples modelos
- **Arena Interface**: UI para comparación lado a lado

## 📚 Recursos Disponibles

### Documentación de Conocimiento

1. **[healthcare-ai-evaluation.md](file:///c:/Github-Personal/luiscendan-private/.agent/knowledge/healthcare-ai-evaluation.md)**
   - Conceptos de evaluación médica
   - Patrones de benchmarking
   - Casos de uso

2. **[evaluation-metrics-guide.md](file:///c:/Github-Personal/luiscendan-private/.agent/knowledge/evaluation-metrics-guide.md)**
   - Guía detallada de cada métrica
   - Cuándo usar cada una
   - Interpretación de resultados

### Herramientas Ejecutables

**[healthcare_evaluator.py](file:///c:/Github-Personal/luiscendan-private/.agent/tools/healthcare_evaluator.py)**
- Script Python con funciones para calcular métricas
- Ejecutar evaluaciones model-as-judge
- Comparar outputs de modelos

## 🛠️ Cómo Usar las Herramientas

### Calcular Métricas ROUGE y BERTScore

```python
from tools.healthcare_evaluator import calculate_text_metrics

# Evaluar un resumen médico
reference = "Patient presents with acute chest pain..."
generated = "The patient has chest pain..."

metrics = calculate_text_metrics(
    reference=reference,
    generated=generated,
    metrics=["rouge", "bertscore"]
)

print(metrics)
# {
#   "rouge1": 0.75,
#   "rouge2": 0.60,
#   "rougeL": 0.70,
#   "bertscore_f1": 0.85
# }
```

### Evaluar Consistencia Factual (TBFact)

```python
from tools.healthcare_evaluator import evaluate_factual_consistency

source_text = "Patient diagnosed with Type 2 diabetes..."
summary = "Patient has diabetes..."

consistency_score = evaluate_factual_consistency(
    source=source_text,
    summary=summary
)

print(f"Factual consistency: {consistency_score}")
```

### Model-as-Judge Evaluation

```python
from tools.healthcare_evaluator import model_as_judge_evaluate

# Evaluar claridad y precisión clínica
result = model_as_judge_evaluate(
    text="Patient presents with acute myocardial infarction...",
    criteria=["clarity", "clinical_accuracy", "completeness"],
    azure_openai_endpoint="https://your-endpoint.openai.azure.com",
    api_key="your-api-key"
)

print(result)
# {
#   "clarity": {"score": 4.5, "reasoning": "..."},
#   "clinical_accuracy": {"score": 5.0, "reasoning": "..."},
#   "completeness": {"score": 4.0, "reasoning": "..."}
# }
```

### Comparar Múltiples Modelos

```python
from tools.healthcare_evaluator import compare_models

models_outputs = {
    "gpt-4": "Patient diagnosed with acute MI...",
    "gpt-3.5": "Patient has heart attack...",
    "custom-model": "Acute myocardial infarction diagnosed..."
}

reference = "Patient presents with acute myocardial infarction..."

comparison = compare_models(
    models_outputs=models_outputs,
    reference=reference,
    metrics=["rouge", "bertscore", "tbfact"]
)

print(comparison)
# Tabla comparativa con scores de cada modelo
```

## 📋 Casos de Uso Comunes

### 1. Evaluar Modelo de Resumen de Notas Clínicas

**Objetivo**: Validar que un modelo genera resúmenes precisos y completos

**Métricas recomendadas**:
- ROUGE (overlap léxico)
- BERTScore (similitud semántica)
- TBFact (consistencia factual)
- Model-as-judge (claridad, completitud)

**Workflow**:
1. Calcular métricas automáticas
2. Ejecutar model-as-judge para métricas subjetivas
3. Revisión por experto clínico si es crítico

### 2. Benchmarking de Modelos de Diagnóstico

**Objetivo**: Comparar precisión de múltiples modelos

**Métricas recomendadas**:
- Exact Match (clasificación correcta)
- Model-as-judge (razonamiento clínico)

**Workflow**:
1. Ejecutar todos los modelos en dataset de prueba
2. Calcular exact match para cada uno
3. Usar model-as-judge para evaluar calidad del razonamiento
4. Comparar resultados en Arena UI

### 3. Validación de Generación de Reportes Radiológicos

**Objetivo**: Asegurar que reportes generados son precisos

**Métricas recomendadas**:
- BERTScore (similitud semántica con reportes de referencia)
- TBFact (consistencia factual con hallazgos)
- Model-as-judge (precisión clínica, completitud)

**Workflow**:
1. Generar reportes con el modelo
2. Calcular BERTScore vs reportes de radiólogos
3. Verificar consistencia factual con TBFact
4. Evaluación por radiólogo experto

## ⚠️ Consideraciones Importantes

### Privacidad de Datos
- **CRÍTICO**: Todos los datos deben estar **desidentificados** (PHI-free)
- Cumplir con HIPAA, GDPR, y regulaciones locales
- No usar datos que puedan identificar pacientes

### Limitaciones de Métricas Automáticas
- ROUGE/BERTScore no capturan precisión clínica
- TBFact puede tener falsos positivos/negativos
- **Siempre** combinar con revisión humana para aplicaciones críticas

### Model-as-Judge
- No usar el mismo modelo para generar y evaluar
- Validar que el LLM tiene conocimiento médico adecuado
- Revisar razonamientos, no solo scores

### Validación Clínica
- Para aplicaciones en producción, **requerido** revisión por expertos
- Métricas automáticas son complementarias, no sustitutos
- Documentar proceso de validación

## 🔗 Enlaces al Repositorio

### Código Fuente de Métricas
- **ROUGE/BERTScore**: `healthcare-ai-model-evaluator/functions/medbench/metrics/text_summarization.py`
- **TBFact**: `healthcare-ai-model-evaluator/functions/medbench/evaluators/tbfact/`
- **Exact Match**: `healthcare-ai-model-evaluator/functions/medbench/metrics/text_exact_match.py`

### Documentación
- **README principal**: `healthcare-ai-model-evaluator/README.md`
- **Functions README**: `healthcare-ai-model-evaluator/functions/README.md`
- **Deployment**: `healthcare-ai-model-evaluator/DEPLOYMENT.md`

## 💡 Flujo de Trabajo Recomendado

1. **Usuario pregunta sobre evaluación de modelos médicos**
   → Consulta `healthcare-ai-evaluation.md` para conceptos

2. **Usuario necesita calcular métricas**
   → Usa `healthcare_evaluator.py` con ejemplos de código

3. **Usuario quiere entender una métrica específica**
   → Referencia `evaluation-metrics-guide.md`

4. **Usuario necesita implementar evaluación completa**
   → Proporciona workflow completo con métricas automáticas + model-as-judge + revisión experta

## 📊 Ejemplo Completo: Pipeline de Evaluación

```python
from tools.healthcare_evaluator import (
    calculate_text_metrics,
    evaluate_factual_consistency,
    model_as_judge_evaluate,
    generate_evaluation_report
)

# 1. Datos de entrada
reference_summary = "Patient diagnosed with Type 2 diabetes..."
model_output = "The patient has diabetes mellitus type 2..."
source_note = "Patient presents with elevated glucose levels..."

# 2. Métricas automáticas
auto_metrics = calculate_text_metrics(
    reference=reference_summary,
    generated=model_output,
    metrics=["rouge", "bertscore"]
)

# 3. Consistencia factual
factual_score = evaluate_factual_consistency(
    source=source_note,
    summary=model_output
)

# 4. Model-as-judge
judge_eval = model_as_judge_evaluate(
    text=model_output,
    criteria=["clarity", "clinical_accuracy", "completeness"]
)

# 5. Generar reporte
report = generate_evaluation_report(
    auto_metrics=auto_metrics,
    factual_score=factual_score,
    judge_eval=judge_eval,
    output_path="evaluation_report.json"
)

print("Evaluation complete! Report saved.")
```

## 🎓 Recursos Adicionales

- **Paper TBFact**: Factual consistency evaluation for medical summarization
- **ROUGE Paper**: Lin, 2004
- **BERTScore Paper**: Zhang et al., 2020
- **Azure OpenAI**: https://learn.microsoft.com/azure/ai-services/openai/

Este skill está diseñado para hacer la evaluación de modelos de IA médica **rigurosa, reproducible y clínicamente válida**.
