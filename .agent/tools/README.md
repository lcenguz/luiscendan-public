# Tools - .agent

Este directorio contiene herramientas ejecutables y scripts reutilizables para funcionalidades de `.agent`.

## 📁 Herramientas Disponibles

### healthcare_evaluator.py

Herramientas para evaluación de modelos de IA médica.

**Funciones principales**:
- `calculate_rouge()` - Métricas ROUGE (overlap léxico)
- `calculate_bertscore()` - Similitud semántica
- `calculate_exact_match()` - Coincidencia exacta
- `evaluate_factual_consistency()` - Consistencia factual (TBFact simplificado)
- `model_as_judge_evaluate()` - Evaluación basada en LLM
- `compare_models()` - Comparación de múltiples modelos
- `generate_evaluation_report()` - Generación de reportes

**Uso**:
```python
from tools.healthcare_evaluator import calculate_rouge, calculate_bertscore

reference = "Patient diagnosed with Type 2 diabetes"
generated = "Patient has diabetes type 2"

# ROUGE
rouge_scores = calculate_rouge(reference, generated)
print(rouge_scores)

# BERTScore
bert_scores = calculate_bertscore(reference, generated)
print(bert_scores)
```

**Requisitos**:
```bash
pip install evaluate rouge-score bert-score openai
```

---

### pdf_analyzer.py

Herramienta para leer, analizar y generar resúmenes HTML de PDFs académicos.

**Funciones principales**:
- `PDFAnalyzer.extract_text()` - Extrae texto con múltiples métodos (PyPDF2, pdfminer)
- `PDFAnalyzer.get_sections()` - Detecta secciones automáticamente
- `PDFAnalyzer.get_statistics()` - Estadísticas del documento
- `PDFAnalyzer.generate_summary()` - Genera resumen automático
- `PDFAnalyzer.generate_html()` - Crea HTML con diseño profesional
- `PDFAnalyzer.save_text()` - Guarda texto plano

**Uso desde línea de comandos**:
```bash
# Analizar un PDF y generar HTML
python .agent/tools/pdf_analyzer.py "documento.pdf"

# Ver estadísticas
python .agent/tools/pdf_analyzer.py "documento.pdf" --stats

# Ver resumen rápido
python .agent/tools/pdf_analyzer.py "documento.pdf" --summary

# Guardar texto plano
python .agent/tools/pdf_analyzer.py "documento.pdf" --text output.txt
```

**Uso programático**:
```python
from tools.pdf_analyzer import PDFAnalyzer

# Crear analizador
analyzer = PDFAnalyzer("documento.pdf")

# Extraer texto
text = analyzer.extract_text(method="auto")

# Obtener estadísticas
stats = analyzer.get_statistics()
print(f"Páginas: {stats['num_pages']}, Palabras: {stats['num_words']}")

# Generar HTML
analyzer.generate_html("output.html", title="Mi Documento")
```

**Requisitos**:
```bash
pip install PyPDF2 pdfminer.six
```

---

### batch_process_pdfs.py

Procesamiento en batch de múltiples PDFs.

**Uso**:
```bash
# Procesar todos los PDFs de una asignatura
python .agent/tools/batch_process_pdfs.py --subject SM141500_Analisis_Informacion

# Procesar un directorio específico
python .agent/tools/batch_process_pdfs.py --input teoria/ --output apuntes/
```

**Documentación completa**: Ver [README_pdf_analyzer.md](README_pdf_analyzer.md)

---

## 🔗 Recursos Relacionados

- **Skill**: [healthcare-ai-evaluator](../skills/healthcare-ai-evaluator/SKILL.md)
- **Knowledge**: 
  - [healthcare-ai-evaluation.md](../knowledge/healthcare-ai-evaluation.md)
  - [evaluation-metrics-guide.md](../knowledge/evaluation-metrics-guide.md)
- **Repositorio fuente**: `c:\Github-Personal\luiscendan-private\healthcare-ai-model-evaluator`

## 💡 Agregar Nuevas Herramientas

Para agregar una nueva herramienta:

1. Crear archivo Python en este directorio
2. Documentar funciones con docstrings
3. Agregar ejemplo de uso en este README
4. Actualizar el generador HTML si es necesario

## 📊 Ejemplo Completo

```python
from tools.healthcare_evaluator import (
    calculate_text_metrics,
    evaluate_factual_consistency,
    generate_evaluation_report
)

# Datos
reference = "Patient diagnosed with acute myocardial infarction..."
generated = "Patient has heart attack..."
source = "Patient presents with chest pain, ECG shows ST elevation..."

# Métricas automáticas
auto_metrics = calculate_text_metrics(
    reference=reference,
    generated=generated,
    metrics=["rouge", "bertscore"]
)

# Consistencia factual
factual_score = evaluate_factual_consistency(
    source=source,
    summary=generated
)

# Generar reporte
report = generate_evaluation_report(
    auto_metrics=auto_metrics,
    factual_score=factual_score,
    output_path="evaluation_report.json"
)

print("✅ Evaluación completa!")
```
