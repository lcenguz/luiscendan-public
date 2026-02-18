# Guía de Métricas de Evaluación - Healthcare AI

Guía práctica y detallada de cada métrica de evaluación para modelos de IA médica.

## 📊 ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

### Descripción

ROUGE mide el **overlap de n-gramas** entre el texto generado y uno o más textos de referencia.

### Variantes

#### ROUGE-1 (Unigrams)
- Mide overlap de palabras individuales
- **Fórmula**: (palabras en común) / (total palabras en referencia)
- **Mejor para**: Evaluar cobertura de vocabulario

#### ROUGE-2 (Bigrams)
- Mide overlap de pares de palabras consecutivas
- **Mejor para**: Evaluar fluidez y estructura

#### ROUGE-L (Longest Common Subsequence)
- Mide la subsecuencia común más larga
- **Mejor para**: Evaluar orden y estructura general

### Interpretación de Scores

| Score | Interpretación |
|-------|----------------|
| 0.0 - 0.2 | Muy bajo - Poca similitud |
| 0.2 - 0.4 | Bajo - Similitud limitada |
| 0.4 - 0.6 | Moderado - Similitud aceptable |
| 0.6 - 0.8 | Bueno - Alta similitud |
| 0.8 - 1.0 | Excelente - Muy alta similitud |

### Cuándo Usar

✅ **Usar para**:
- Resúmenes de notas clínicas
- Generación de reportes médicos
- Respuestas a preguntas factuales
- Cuando existe texto de referencia gold-standard

❌ **No usar para**:
- Evaluación de precisión clínica
- Cuando paráfrasis son válidas
- Textos creativos o abiertos
- Evaluación semántica profunda

### Ejemplo Práctico

```python
from tools.healthcare_evaluator import calculate_rouge

reference = "Patient diagnosed with Type 2 diabetes mellitus and hypertension"
generated = "Patient has diabetes type 2 and high blood pressure"

scores = calculate_rouge(reference, generated)
print(scores)
# {
#   "rouge1": 0.50,  # 4/8 palabras coinciden
#   "rouge2": 0.14,  # 1/7 bigrams coinciden
#   "rougeL": 0.38   # Subsecuencia común
# }
```

### Limitaciones

- **No captura sinónimos**: "diabetes" ≠ "diabetes mellitus"
- **No entiende paráfrasis**: "high blood pressure" ≠ "hypertension"
- **Sensible a orden**: Cambiar orden reduce score
- **No evalúa precisión**: Score alto no garantiza corrección médica

---

## 🧠 BERTScore

### Descripción

BERTScore mide **similitud semántica** usando embeddings contextuales de BERT.

### Cómo Funciona

1. Genera embeddings para cada token usando BERT
2. Calcula similitud coseno entre embeddings
3. Alinea tokens del texto generado con la referencia
4. Computa precision, recall, y F1

### Métricas

- **Precision**: ¿Qué proporción del texto generado es relevante?
- **Recall**: ¿Qué proporción de la referencia está cubierta?
- **F1**: Media armónica de precision y recall

### Interpretación de Scores

| Score | Interpretación |
|-------|----------------|
| < 0.7 | Baja similitud semántica |
| 0.7 - 0.8 | Similitud moderada |
| 0.8 - 0.9 | Alta similitud |
| > 0.9 | Muy alta similitud |

### Cuándo Usar

✅ **Usar para**:
- Cuando sinónimos y paráfrasis son válidos
- Evaluación semántica de textos médicos
- Comparación de descripciones clínicas
- Cuando ROUGE es demasiado estricto

❌ **No usar para**:
- Evaluación de precisión factual
- Cuando velocidad es crítica (más lento que ROUGE)
- Recursos computacionales limitados

### Ejemplo Práctico

```python
from tools.healthcare_evaluator import calculate_bertscore

reference = "acute myocardial infarction with ST elevation"
generated = "heart attack with ST segment elevation"

score = calculate_bertscore(reference, generated)
print(score)
# {
#   "precision": 0.87,
#   "recall": 0.85,
#   "f1": 0.86  # Alta similitud semántica
# }
```

### Ventajas sobre ROUGE

- ✅ Captura sinónimos médicos
- ✅ Entiende paráfrasis
- ✅ Contexto semántico
- ✅ Más robusto a variaciones

### Limitaciones

- Más lento que ROUGE
- Requiere GPU para velocidad óptima
- No garantiza precisión factual
- Puede dar scores altos a textos incorrectos pero semánticamente similares

---

## ✅ TBFact (Factual Consistency)

### Descripción

TBFact evalúa si el **resumen contiene información factualmente correcta** respecto al texto fuente.

### Cómo Funciona

1. Extrae hechos/claims del texto fuente
2. Extrae hechos del resumen generado
3. Verifica si cada hecho del resumen está soportado por la fuente
4. Calcula score de consistencia

### Interpretación de Scores

| Score | Interpretación |
|-------|----------------|
| < 0.5 | Baja consistencia - Muchos errores factuales |
| 0.5 - 0.7 | Consistencia moderada - Algunos errores |
| 0.7 - 0.9 | Alta consistencia - Pocos errores |
| > 0.9 | Muy alta consistencia - Casi sin errores |

### Cuándo Usar

✅ **Usar para**:
- Resúmenes de notas clínicas
- Generación de reportes radiológicos
- Cualquier tarea donde precisión factual es CRÍTICA
- Detección de alucinaciones

❌ **No usar para**:
- Textos creativos
- Cuando no hay texto fuente de referencia
- Evaluación de completitud (solo evalúa consistencia)

### Ejemplo Práctico

```python
from tools.healthcare_evaluator import calculate_tbfact

source = """
Patient presents with chest pain radiating to left arm.
ECG shows ST elevation in leads II, III, aVF.
Troponin levels elevated at 2.5 ng/mL.
Diagnosed with inferior wall myocardial infarction.
"""

summary = "Patient diagnosed with heart attack based on ECG and troponin"

score = calculate_tbfact(source, summary)
print(score)
# 0.85 - Alta consistencia factual
```

### Crítico Para

- **Aplicaciones clínicas**: Errores factuales pueden ser peligrosos
- **Resúmenes médicos**: Precisión es esencial
- **Reportes de diagnóstico**: No puede haber alucinaciones

### Limitaciones

- Puede tener falsos positivos (marca como correcto algo incorrecto)
- Puede tener falsos negativos (marca como incorrecto algo correcto)
- No evalúa completitud (solo consistencia)
- Requiere texto fuente

---

## 🎯 Exact Match

### Descripción

Exact Match verifica si la **predicción coincide exactamente** con el ground truth.

### Interpretación

- **1**: Coincidencia exacta
- **0**: No coincide

### Cuándo Usar

✅ **Usar para**:
- Clasificación de diagnósticos
- Categorización de condiciones
- Tareas de respuesta única
- Cuando solo hay una respuesta correcta

❌ **No usar para**:
- Generación de texto libre
- Cuando múltiples respuestas son válidas
- Evaluación de resúmenes

### Ejemplo Práctico

```python
from tools.healthcare_evaluator import calculate_exact_match

ground_truth = "Type 2 Diabetes Mellitus"

# Caso 1: Coincidencia exacta
prediction1 = "Type 2 Diabetes Mellitus"
print(calculate_exact_match(ground_truth, prediction1))  # 1

# Caso 2: No coincide (aunque semánticamente similar)
prediction2 = "Diabetes Mellitus Type 2"
print(calculate_exact_match(ground_truth, prediction2))  # 0
```

### Variantes Útiles

#### Exact Match (Case-Insensitive)
```python
calculate_exact_match(gt, pred, case_sensitive=False)
```

#### Exact Match (Normalized)
```python
# Normaliza espacios, puntuación
calculate_exact_match(gt, pred, normalize=True)
```

### Limitaciones

- Muy estricto
- No captura respuestas semánticamente equivalentes
- Sensible a formato y espacios

---

## 🤖 Model-as-Judge

### Descripción

Usa un LLM (como GPT-4) para **evaluar outputs según criterios específicos**.

### Criterios Comunes

1. **Claridad** (1-5): ¿Es fácil de entender?
2. **Precisión Clínica** (1-5): ¿Es médicamente preciso?
3. **Completitud** (1-5): ¿Incluye información relevante?
4. **Relevancia** (1-5): ¿Es relevante para el contexto?
5. **Coherencia** (1-5): ¿Es lógicamente coherente?

### Interpretación de Scores

| Score | Interpretación |
|-------|----------------|
| 1 | Muy pobre |
| 2 | Pobre |
| 3 | Aceptable |
| 4 | Bueno |
| 5 | Excelente |

### Cuándo Usar

✅ **Usar para**:
- Evaluar aspectos subjetivos
- Cuando necesitas razonamiento
- Métricas automáticas no capturan calidad
- Escalabilidad vs revisión humana

❌ **No usar para**:
- Sustituto de validación clínica
- Cuando métricas objetivas son suficientes
- Presupuesto limitado (costos de API)

### Ejemplo Práctico

```python
from tools.healthcare_evaluator import model_as_judge

text = """
Patient presents with acute chest pain radiating to left arm,
accompanied by diaphoresis and dyspnea. ECG shows ST elevation.
Diagnosis: Acute myocardial infarction.
"""

result = model_as_judge(
    text=text,
    criteria=["clarity", "clinical_accuracy", "completeness"],
    model="gpt-4"
)

print(result)
# {
#   "clarity": {
#     "score": 5,
#     "reasoning": "Text is clear and well-structured..."
#   },
#   "clinical_accuracy": {
#     "score": 5,
#     "reasoning": "Clinically accurate presentation..."
#   },
#   "completeness": {
#     "score": 4,
#     "reasoning": "Includes key symptoms and findings..."
#   }
# }
```

### Best Practices

1. **Prompts claros y específicos**
2. **Solicitar razonamiento** (no solo scores)
3. **No usar mismo modelo** para generar y evaluar
4. **Validar con expertos** humanos
5. **Documentar criterios** de evaluación

### Limitaciones

- Sesgos del LLM
- Variabilidad en evaluaciones
- Costos de API
- No sustituye validación clínica

---

## 📋 Tabla Comparativa de Métricas

| Métrica | Velocidad | Precisión Factual | Captura Semántica | Requiere Referencia | Uso Principal |
|---------|-----------|-------------------|-------------------|---------------------|---------------|
| **ROUGE** | ⚡⚡⚡ | ❌ | ❌ | ✅ | Resúmenes |
| **BERTScore** | ⚡⚡ | ❌ | ✅ | ✅ | Similitud semántica |
| **TBFact** | ⚡ | ✅ | ⚡ | ✅ (fuente) | Consistencia factual |
| **Exact Match** | ⚡⚡⚡ | ✅ | ❌ | ✅ | Clasificación |
| **Model-as-Judge** | ⚡ | ⚡ | ✅ | ❌ | Evaluación subjetiva |

---

## 🎯 Recomendaciones por Caso de Uso

### Resumen de Notas Clínicas
1. **ROUGE** - Overlap léxico
2. **BERTScore** - Similitud semántica
3. **TBFact** - Consistencia factual
4. **Model-as-Judge** - Claridad y completitud

### Clasificación de Diagnósticos
1. **Exact Match** - Clasificación correcta
2. **Accuracy/F1** - Métricas de clasificación
3. **Model-as-Judge** - Razonamiento clínico

### Generación de Reportes
1. **BERTScore** - Similitud con reportes de referencia
2. **TBFact** - Consistencia factual
3. **Model-as-Judge** - Precisión clínica

### Respuesta a Preguntas
1. **ROUGE/BERTScore** - Similitud con respuestas de referencia
2. **Exact Match** - Para respuestas únicas
3. **Model-as-Judge** - Relevancia y precisión

---

## 💡 Tips Prácticos

1. **Combina múltiples métricas** - Ninguna métrica es perfecta
2. **Establece umbrales** - Define qué scores son aceptables
3. **Valida con expertos** - Métricas automáticas son complementarias
4. **Documenta decisiones** - Explica por qué usas cada métrica
5. **Itera y mejora** - Ajusta según feedback clínico

## 🔗 Ver También

- [healthcare-ai-evaluation.md](./healthcare-ai-evaluation.md) - Guía completa de evaluación
- [healthcare-ai-evaluator skill](../skills/healthcare-ai-evaluator/SKILL.md) - Skill para evaluación
- [healthcare_evaluator.py](../tools/healthcare_evaluator.py) - Herramientas ejecutables
