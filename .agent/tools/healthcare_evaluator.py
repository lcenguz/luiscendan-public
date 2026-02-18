"""
Healthcare AI Model Evaluator - Tools

Herramientas reutilizables para evaluación de modelos de IA médica.
Incluye métricas automáticas (ROUGE, BERTScore, TBFact) y model-as-judge.

Basado en: microsoft/healthcare-ai-model-evaluator
Repositorio: c:\\Github-Personal\\luiscendan-private\\healthcare-ai-model-evaluator
"""

from typing import Dict, List, Optional, Union
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')


def calculate_rouge(reference: str, generated: str, use_stemmer: bool = True) -> Dict[str, float]:
    """
    Calcula métricas ROUGE entre texto generado y referencia.
    
    Args:
        reference: Texto de referencia (ground truth)
        generated: Texto generado por el modelo
        use_stemmer: Usar stemming para normalización
    
    Returns:
        Dict con scores: rouge1, rouge2, rougeL
    
    Example:
        >>> ref = "Patient diagnosed with Type 2 diabetes"
        >>> gen = "Patient has diabetes type 2"
        >>> scores = calculate_rouge(ref, gen)
        >>> print(scores)
        {'rouge1': 0.50, 'rouge2': 0.14, 'rougeL': 0.38}
    """
    try:
        import evaluate
        rouge = evaluate.load("rouge")
        
        results = rouge.compute(
            predictions=[generated],
            references=[reference],
            rouge_types=["rouge1", "rouge2", "rougeL"],
            use_stemmer=use_stemmer
        )
        
        return {
            "rouge1": round(results["rouge1"], 4),
            "rouge2": round(results["rouge2"], 4),
            "rougeL": round(results["rougeL"], 4)
        }
    except ImportError:
        print("⚠️  Install required package: pip install evaluate rouge-score")
        return {}


def calculate_bertscore(
    reference: str, 
    generated: str, 
    model_type: str = "bert-base-uncased",
    lang: str = "en"
) -> Dict[str, float]:
    """
    Calcula BERTScore para similitud semántica.
    
    Args:
        reference: Texto de referencia
        generated: Texto generado
        model_type: Modelo BERT a usar
        lang: Idioma del texto
    
    Returns:
        Dict con precision, recall, f1
    
    Example:
        >>> ref = "acute myocardial infarction"
        >>> gen = "heart attack"
        >>> score = calculate_bertscore(ref, gen)
        >>> print(score)
        {'precision': 0.87, 'recall': 0.85, 'f1': 0.86}
    """
    try:
        import evaluate
        bertscore = evaluate.load("bertscore")
        
        results = bertscore.compute(
            predictions=[generated],
            references=[reference],
            lang=lang,
            model_type=model_type
        )
        
        return {
            "precision": round(results["precision"][0], 4),
            "recall": round(results["recall"][0], 4),
            "f1": round(results["f1"][0], 4)
        }
    except ImportError:
        print("⚠️  Install required package: pip install evaluate bert-score")
        return {}


def calculate_exact_match(
    ground_truth: str, 
    prediction: str,
    case_sensitive: bool = True,
    normalize: bool = False
) -> int:
    """
    Calcula exact match entre predicción y ground truth.
    
    Args:
        ground_truth: Respuesta correcta
        prediction: Predicción del modelo
        case_sensitive: Considerar mayúsculas/minúsculas
        normalize: Normalizar espacios y puntuación
    
    Returns:
        1 si coincide, 0 si no
    
    Example:
        >>> gt = "Type 2 Diabetes"
        >>> pred = "Type 2 Diabetes"
        >>> calculate_exact_match(gt, pred)
        1
    """
    gt = ground_truth
    pred = prediction
    
    if normalize:
        import re
        gt = re.sub(r'\s+', ' ', gt).strip()
        pred = re.sub(r'\s+', ' ', pred).strip()
    
    if not case_sensitive:
        gt = gt.lower()
        pred = pred.lower()
    
    return 1 if gt == pred else 0


def calculate_text_metrics(
    reference: str,
    generated: str,
    metrics: List[str] = ["rouge", "bertscore"]
) -> Dict[str, Union[float, Dict]]:
    """
    Calcula múltiples métricas de texto.
    
    Args:
        reference: Texto de referencia
        generated: Texto generado
        metrics: Lista de métricas a calcular ["rouge", "bertscore"]
    
    Returns:
        Dict con todas las métricas calculadas
    
    Example:
        >>> ref = "Patient presents with acute chest pain"
        >>> gen = "Patient has chest pain"
        >>> metrics = calculate_text_metrics(ref, gen)
        >>> print(metrics)
    """
    results = {}
    
    if "rouge" in metrics:
        results["rouge"] = calculate_rouge(reference, generated)
    
    if "bertscore" in metrics:
        results["bertscore"] = calculate_bertscore(reference, generated)
    
    return results


def evaluate_factual_consistency(
    source: str,
    summary: str
) -> float:
    """
    Evalúa consistencia factual del resumen respecto a la fuente.
    
    NOTA: Esta es una implementación simplificada. Para producción,
    usa el evaluador TBFact completo del repositorio healthcare-ai-model-evaluator.
    
    Args:
        source: Texto fuente original
        summary: Resumen generado
    
    Returns:
        Score de consistencia (0.0 - 1.0)
    
    Example:
        >>> source = "Patient diagnosed with Type 2 diabetes..."
        >>> summary = "Patient has diabetes..."
        >>> score = evaluate_factual_consistency(source, summary)
        >>> print(f"Consistency: {score}")
    """
    print("⚠️  Implementación simplificada de TBFact")
    print("   Para producción, usa el evaluador completo en:")
    print("   healthcare-ai-model-evaluator/functions/medbench/evaluators/tbfact/")
    
    # Implementación básica usando overlap de palabras clave
    source_words = set(source.lower().split())
    summary_words = set(summary.lower().split())
    
    overlap = len(source_words & summary_words)
    consistency = overlap / len(summary_words) if summary_words else 0.0
    
    return round(consistency, 4)


def model_as_judge_evaluate(
    text: str,
    criteria: List[str] = ["clarity", "clinical_accuracy", "completeness"],
    azure_openai_endpoint: Optional[str] = None,
    api_key: Optional[str] = None,
    model: str = "gpt-4"
) -> Dict[str, Dict[str, Union[int, str]]]:
    """
    Evalúa texto usando LLM como juez (model-as-judge).
    
    Args:
        text: Texto a evaluar
        criteria: Lista de criterios ["clarity", "clinical_accuracy", etc.]
        azure_openai_endpoint: Endpoint de Azure OpenAI
        api_key: API key
        model: Modelo a usar (gpt-4, gpt-3.5-turbo, etc.)
    
    Returns:
        Dict con score y razonamiento para cada criterio
    
    Example:
        >>> text = "Patient presents with acute MI..."
        >>> result = model_as_judge_evaluate(text, criteria=["clarity"])
        >>> print(result)
    """
    print("⚠️  Implementación de ejemplo de model-as-judge")
    print("   Para producción, configura Azure OpenAI credentials")
    
    if not azure_openai_endpoint or not api_key:
        print("\n   Uso:")
        print("   result = model_as_judge_evaluate(")
        print("       text='...',")
        print("       criteria=['clarity', 'clinical_accuracy'],")
        print("       azure_openai_endpoint='https://your-endpoint.openai.azure.com',")
        print("       api_key='your-api-key'")
        print("   )")
        return {}
    
    try:
        from openai import AzureOpenAI
        
        client = AzureOpenAI(
            azure_endpoint=azure_openai_endpoint,
            api_key=api_key,
            api_version="2024-02-01"
        )
        
        results = {}
        
        for criterion in criteria:
            prompt = f"""
            Evalúa el siguiente texto médico según el criterio: {criterion}
            
            Texto:
            {text}
            
            Proporciona:
            1. Score (1-5): 1=muy pobre, 5=excelente
            2. Razonamiento detallado
            
            Formato de respuesta:
            Score: [número]
            Razonamiento: [explicación]
            """
            
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            content = response.choices[0].message.content
            
            # Parse response
            lines = content.split('\n')
            score = None
            reasoning = ""
            
            for line in lines:
                if line.startswith("Score:"):
                    try:
                        score = int(line.split(":")[1].strip())
                    except:
                        score = 3
                elif line.startswith("Razonamiento:"):
                    reasoning = line.split(":", 1)[1].strip()
            
            results[criterion] = {
                "score": score or 3,
                "reasoning": reasoning or content
            }
        
        return results
        
    except ImportError:
        print("⚠️  Install required package: pip install openai")
        return {}
    except Exception as e:
        print(f"❌ Error: {e}")
        return {}


def compare_models(
    models_outputs: Dict[str, str],
    reference: str,
    metrics: List[str] = ["rouge", "bertscore"]
) -> Dict[str, Dict]:
    """
    Compara outputs de múltiples modelos.
    
    Args:
        models_outputs: Dict {model_name: output_text}
        reference: Texto de referencia
        metrics: Métricas a calcular
    
    Returns:
        Dict con scores de cada modelo
    
    Example:
        >>> outputs = {
        ...     "gpt-4": "Patient has diabetes...",
        ...     "gpt-3.5": "Patient diagnosed with diabetes...",
        ... }
        >>> ref = "Patient diagnosed with Type 2 diabetes..."
        >>> comparison = compare_models(outputs, ref)
        >>> print(comparison)
    """
    results = {}
    
    for model_name, output in models_outputs.items():
        results[model_name] = calculate_text_metrics(
            reference=reference,
            generated=output,
            metrics=metrics
        )
    
    return results


def generate_evaluation_report(
    auto_metrics: Dict,
    factual_score: Optional[float] = None,
    judge_eval: Optional[Dict] = None,
    output_path: Optional[str] = None
) -> Dict:
    """
    Genera reporte completo de evaluación.
    
    Args:
        auto_metrics: Métricas automáticas (ROUGE, BERTScore)
        factual_score: Score de consistencia factual
        judge_eval: Evaluación model-as-judge
        output_path: Ruta para guardar reporte JSON
    
    Returns:
        Dict con reporte completo
    
    Example:
        >>> report = generate_evaluation_report(
        ...     auto_metrics={'rouge': {...}, 'bertscore': {...}},
        ...     factual_score=0.85,
        ...     judge_eval={'clarity': {'score': 4, 'reasoning': '...'}}
        ... )
    """
    import json
    from datetime import datetime
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "automatic_metrics": auto_metrics,
        "factual_consistency": factual_score,
        "model_as_judge": judge_eval
    }
    
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"✅ Reporte guardado en: {output_path}")
    
    return report


# Ejemplo de uso
if __name__ == "__main__":
    print("=" * 60)
    print("Healthcare AI Model Evaluator - Tools Demo")
    print("=" * 60)
    
    # Datos de ejemplo
    reference = "Patient diagnosed with Type 2 diabetes mellitus and hypertension"
    generated = "Patient has diabetes type 2 and high blood pressure"
    
    print("\n📊 Calculando ROUGE...")
    rouge_scores = calculate_rouge(reference, generated)
    print(f"ROUGE scores: {rouge_scores}")
    
    print("\n🧠 Calculando BERTScore...")
    bert_scores = calculate_bertscore(reference, generated)
    print(f"BERTScore: {bert_scores}")
    
    print("\n✅ Calculando Exact Match...")
    exact = calculate_exact_match(reference, generated)
    print(f"Exact Match: {exact}")
    
    print("\n" + "=" * 60)
    print("Para usar model-as-judge, configura Azure OpenAI credentials")
    print("=" * 60)
