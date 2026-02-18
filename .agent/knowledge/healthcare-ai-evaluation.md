# Healthcare AI Evaluation - Guía de Referencia

## 📋 Visión General

La **evaluación de modelos de IA médica** requiere métricas rigurosas y validación clínica para asegurar precisión, seguridad y utilidad en entornos clínicos. Este documento proporciona una guía completa sobre evaluación de modelos médicos usando el framework **Microsoft Healthcare AI Model Evaluator**.

**Repositorio**: `c:\Github-Personal\luiscendan-private\healthcare-ai-model-evaluator`

## 🎯 Tipos de Evaluación

### 1. Métricas Automáticas
Evaluación cuantitativa sin intervención humana:
- **ROUGE**: Overlap léxico (n-gramas)
- **BERTScore**: Similitud semántica
- **BLEU/METEOR**: Métricas de traducción adaptadas
- **Exact Match**: Clasificación exacta

### 2. Evaluación Basada en LLM (Model-as-Judge)
Uso de modelos de lenguaje para evaluar outputs:
- Métricas subjetivas (claridad, completitud)
- Razonamiento clínico
- Precisión médica
- Relevancia contextual

### 3. Evaluación por Expertos
Validación por profesionales médicos:
- Revisión clínica
- Validación de diagnósticos
- Verificación de recomendaciones
- Aprobación para uso clínico

### 4. Evaluación de Consistencia Factual
Verificación de precisión factual:
- **TBFact**: Factual consistency para resúmenes
- Verificación de hallazgos vs fuente
- Detección de alucinaciones

## 📊 Métricas Principales

### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

**Qué mide**: Overlap de n-gramas entre texto generado y referencia

**Variantes**:
- **ROUGE-1**: Unigrams (palabras individuales)
- **ROUGE-2**: Bigrams (pares de palabras)
- **ROUGE-L**: Longest Common Subsequence

**Rango**: 0.0 - 1.0 (mayor es mejor)

**Cuándo usar**:
- Resúmenes de notas clínicas
- Generación de reportes médicos
- Respuestas a preguntas médicas

**Limitaciones**:
- No captura similitud semántica
- Sensible a sinónimos y paráfrasis
- No evalúa precisión clínica

**Ejemplo**:
```
Referencia: "Patient diagnosed with Type 2 diabetes mellitus"
Generado:   "Patient has diabetes type 2"
ROUGE-1: 0.60 (3/5 palabras coinciden)
ROUGE-2: 0.25 (1/4 bigrams coinciden)
```

### BERTScore

**Qué mide**: Similitud semántica usando embeddings contextuales

**Métricas**: Precision, Recall, F1

**Rango**: 0.0 - 1.0 (mayor es mejor)

**Cuándo usar**:
- Cuando sinónimos y paráfrasis son válidos
- Evaluación semántica de textos médicos
- Comparación de descripciones clínicas

**Ventajas sobre ROUGE**:
- Captura paráfrasis
- Entiende sinónimos médicos
- Contexto semántico

**Limitaciones**:
- Más lento que ROUGE
- Requiere más recursos computacionales
- No garantiza precisión factual

**Ejemplo**:
```
Referencia: "acute myocardial infarction"
Generado:   "heart attack"
ROUGE: Bajo (0 palabras coinciden)
BERTScore: Alto (~0.85, semánticamente similar)
```

### TBFact (Factual Consistency)

**Qué mide**: Si el resumen contiene información factualmente correcta respecto a la fuente

**Rango**: 0.0 - 1.0 (mayor es mejor)

**Cuándo usar**:
- Resúmenes de notas clínicas
- Generación de reportes radiológicos
- Cualquier tarea donde precisión factual es crítica

**Cómo funciona**:
1. Extrae hechos del texto fuente
2. Verifica si cada hecho está presente en el resumen
3. Calcula score de consistencia

**Crítico para**:
- Aplicaciones clínicas
- Resúmenes de historias médicas
- Reportes de diagnóstico

**Limitaciones**:
- Puede tener falsos positivos/negativos
- Requiere texto fuente de referencia
- No evalúa completitud

### Exact Match

**Qué mide**: Coincidencia exacta entre predicción y ground truth

**Rango**: 0 o 1 (binario)

**Cuándo usar**:
- Clasificación de diagnósticos
- Categorización de condiciones
- Tareas de respuesta única

**Ejemplo**:
```
Ground truth: "Type 2 Diabetes"
Predicción:    "Type 2 Diabetes" → Exact Match = 1
Predicción:    "Diabetes Type 2" → Exact Match = 0
```

## 🤖 Model-as-Judge

### Concepto

Usar un LLM (como GPT-4) para evaluar outputs de otros modelos según criterios específicos.

### Criterios Comunes

1. **Claridad**: ¿Es el texto claro y comprensible?
2. **Completitud**: ¿Incluye toda la información relevante?
3. **Precisión Clínica**: ¿Es médicamente preciso?
4. **Relevancia**: ¿Es relevante para el contexto?
5. **Coherencia**: ¿Es lógicamente coherente?

### Ventajas

- Evalúa aspectos subjetivos
- Proporciona razonamiento
- Flexible para diferentes criterios
- Escala mejor que revisión humana

### Limitaciones

- Puede tener sesgos del LLM
- No sustituye validación clínica
- Requiere prompts bien diseñados
- Costos de API

### Best Practices

1. **No usar el mismo modelo para generar y evaluar**
   - ❌ Usar GPT-4 para evaluar outputs de GPT-4
   - ✅ Usar GPT-4 para evaluar outputs de GPT-3.5 o custom models

2. **Proporcionar criterios claros**
   ```
   Evalúa el siguiente resumen médico según:
   - Claridad (1-5): ¿Es fácil de entender?
   - Precisión (1-5): ¿Es médicamente preciso?
   - Completitud (1-5): ¿Incluye información relevante?
   ```

3. **Solicitar razonamiento**
   ```
   Para cada criterio, proporciona:
   - Score (1-5)
   - Razonamiento detallado
   - Ejemplos específicos del texto
   ```

4. **Validar con expertos**
   - Comparar evaluaciones del LLM con expertos humanos
   - Ajustar prompts según discrepancias

## 🏥 Casos de Uso por Tipo de Aplicación

### Resumen de Notas Clínicas

**Objetivo**: Generar resúmenes concisos de historias médicas

**Métricas recomendadas**:
- ROUGE (overlap con resúmenes de referencia)
- BERTScore (similitud semántica)
- TBFact (consistencia factual)
- Model-as-judge (claridad, completitud)

**Pipeline**:
1. Generar resumen con modelo
2. Calcular ROUGE y BERTScore vs resúmenes de referencia
3. Verificar consistencia factual con TBFact
4. Evaluar claridad y completitud con model-as-judge
5. Revisión por médico para casos críticos

### Generación de Reportes Radiológicos

**Objetivo**: Generar reportes a partir de imágenes médicas

**Métricas recomendadas**:
- BERTScore (similitud con reportes de radiólogos)
- TBFact (consistencia con hallazgos)
- Model-as-judge (precisión clínica, terminología)

**Pipeline**:
1. Generar reporte desde imagen
2. Comparar con reportes de radiólogos (BERTScore)
3. Verificar consistencia factual
4. Evaluación por radiólogo experto

### Clasificación de Diagnósticos

**Objetivo**: Clasificar condiciones médicas

**Métricas recomendadas**:
- Exact Match (clasificación correcta)
- Accuracy, Precision, Recall, F1
- Model-as-judge (razonamiento clínico)

**Pipeline**:
1. Clasificar con modelo
2. Calcular exact match y métricas de clasificación
3. Evaluar razonamiento con model-as-judge
4. Validación por médico para casos ambiguos

### Respuesta a Preguntas Médicas

**Objetivo**: Responder preguntas sobre información médica

**Métricas recomendadas**:
- ROUGE/BERTScore (similitud con respuestas de referencia)
- Model-as-judge (precisión, relevancia)
- Exact Match (para preguntas de respuesta única)

**Pipeline**:
1. Generar respuesta
2. Comparar con respuestas de referencia
3. Evaluar precisión y relevancia con model-as-judge
4. Verificación por experto para información crítica

## ⚠️ Consideraciones Críticas

### Privacidad y Seguridad

- **HIPAA Compliance**: Todos los datos deben estar desidentificados
- **PHI-Free**: No usar información que identifique pacientes
- **GDPR**: Cumplir con regulaciones de privacidad
- **Auditoría**: Documentar uso de datos

### Limitaciones de Métricas Automáticas

- **No garantizan precisión clínica**: ROUGE alto ≠ médicamente correcto
- **Pueden ser engañadas**: Modelos pueden optimizar métricas sin ser útiles
- **Contexto importa**: Misma métrica puede significar cosas diferentes según aplicación

### Validación Clínica Obligatoria

Para aplicaciones en producción:
- **Revisión por expertos** es REQUERIDA
- Métricas automáticas son **complementarias**, no sustitutos
- Documentar proceso de validación
- Establecer umbrales de confianza

### Transparencia y Explicabilidad

- Documentar qué métricas se usan y por qué
- Proporcionar razonamiento de evaluaciones
- Ser transparente sobre limitaciones
- Permitir revisión humana

## 📚 Recursos Adicionales

### Papers de Referencia

- **ROUGE**: Lin, C. Y. (2004). ROUGE: A Package for Automatic Evaluation of Summaries
- **BERTScore**: Zhang et al. (2020). BERTScore: Evaluating Text Generation with BERT
- **TBFact**: Factual Consistency Evaluation for Medical Summarization

### Herramientas

- **HuggingFace Evaluate**: https://huggingface.co/docs/evaluate/
- **Azure OpenAI**: https://learn.microsoft.com/azure/ai-services/openai/
- **Healthcare AI Evaluator**: Ver [evaluation-metrics-guide.md](./evaluation-metrics-guide.md)

### Guías Relacionadas

- [evaluation-metrics-guide.md](./evaluation-metrics-guide.md) - Guía detallada de métricas
- [healthcare-ai-evaluator skill](../skills/healthcare-ai-evaluator/SKILL.md) - Skill para evaluación
- [healthcare_evaluator.py](../tools/healthcare_evaluator.py) - Herramientas ejecutables

## 🎯 Resumen Ejecutivo

| Métrica | Qué Mide | Cuándo Usar | Limitaciones |
|---------|----------|-------------|--------------|
| **ROUGE** | Overlap léxico | Resúmenes, reportes | No captura semántica |
| **BERTScore** | Similitud semántica | Paráfrasis, sinónimos | No garantiza precisión factual |
| **TBFact** | Consistencia factual | Resúmenes médicos | Falsos positivos/negativos |
| **Exact Match** | Coincidencia exacta | Clasificación | Muy estricto |
| **Model-as-Judge** | Criterios subjetivos | Claridad, precisión | Sesgos del LLM |

**Regla de oro**: Combina métricas automáticas + model-as-judge + revisión experta para evaluación robusta.
