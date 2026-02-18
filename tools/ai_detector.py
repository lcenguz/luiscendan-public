#!/usr/bin/env python3
"""
AI Writing Pattern Detector
Based on Wikipedia's "Signs of AI writing" guide
"""

import re
from pathlib import Path
from typing import Dict, List, Tuple
import PyPDF2


class AIPatternDetector:
    """Detects AI-generated writing patterns in text."""
    
    def __init__(self):
        # Pattern definitions from the humanizer skill
        self.patterns = {
            "inflated_symbolism": {
                "keywords": [
                    r"\bstands as\b", r"\bserves as\b", r"\bis a testament\b", 
                    r"\ba vital role\b", r"\bcrucial role\b", r"\bpivotal\b",
                    r"\bunderscores\b", r"\bhighlights its importance\b",
                    r"\breflects broader\b", r"\bsymbolizing\b", r"\benduring\b",
                    r"\bcontributing to the\b", r"\bsetting the stage\b",
                    r"\bmarking the\b", r"\bshaping the\b", r"\bkey turning point\b",
                    r"\bevolving landscape\b", r"\bindelible mark\b"
                ],
                "weight": 2
            },
            "promotional_language": {
                "keywords": [
                    r"\bboasts a\b", r"\bvibrant\b", r"\brich\b", r"\bprofound\b",
                    r"\benhancing its\b", r"\bshowcasing\b", r"\bexemplifies\b",
                    r"\bcommitment to\b", r"\bnatural beauty\b", r"\bnestled\b",
                    r"\bin the heart of\b", r"\bgroundbreaking\b", r"\brenowned\b",
                    r"\bbreathtaking\b", r"\bmust-visit\b", r"\bstunning\b"
                ],
                "weight": 3
            },
            "superficial_ing": {
                "keywords": [
                    r",\s+highlighting\b", r",\s+underscoring\b", r",\s+emphasizing\b",
                    r",\s+ensuring\b", r",\s+reflecting\b", r",\s+symbolizing\b",
                    r",\s+contributing to\b", r",\s+cultivating\b", r",\s+fostering\b",
                    r",\s+encompassing\b", r",\s+showcasing\b"
                ],
                "weight": 2
            },
            "vague_attributions": {
                "keywords": [
                    r"\bIndustry reports\b", r"\bObservers have cited\b",
                    r"\bExperts argue\b", r"\bSome critics argue\b",
                    r"\bseveral sources\b", r"\bseveral publications\b"
                ],
                "weight": 2
            },
            "ai_vocabulary": {
                "keywords": [
                    r"\bAdditionally\b", r"\balign with\b", r"\bcrucial\b",
                    r"\bdelve\b", r"\bemphasizing\b", r"\benduring\b",
                    r"\benhance\b", r"\bfostering\b", r"\bgarner\b",
                    r"\bhighlight\b", r"\binterplay\b", r"\bintricate\b",
                    r"\bintricacies\b", r"\bkey\b", r"\blandscape\b",
                    r"\bpivotal\b", r"\bshowcase\b", r"\btapestry\b",
                    r"\btestament\b", r"\bunderscore\b", r"\bvaluable\b",
                    r"\bvibrant\b"
                ],
                "weight": 1
            },
            "copula_avoidance": {
                "keywords": [
                    r"\bserves as\b", r"\bstands as\b", r"\bmarks a\b",
                    r"\brepresents a\b", r"\bboasts\b", r"\bfeatures\b",
                    r"\boffers a\b"
                ],
                "weight": 1
            },
            "negative_parallelism": {
                "keywords": [
                    r"\bNot only\b.*\bbut\b", r"\bIt's not just\b.*\bit's\b",
                    r"\bnot merely\b.*\bit's\b"
                ],
                "weight": 2
            },
            "rule_of_three": {
                "keywords": [
                    r"\b\w+,\s+\w+,\s+and\s+\w+\b"
                ],
                "weight": 0.5
            },
            "em_dash_overuse": {
                "keywords": [r"—"],
                "weight": 0.5
            },
            "collaborative_artifacts": {
                "keywords": [
                    r"\bI hope this helps\b", r"\bOf course!\b", r"\bCertainly!\b",
                    r"\bYou're absolutely right\b", r"\bWould you like\b",
                    r"\blet me know\b", r"\bhere is a\b"
                ],
                "weight": 5
            },
            "knowledge_cutoff": {
                "keywords": [
                    r"\bas of\s+\d{4}\b", r"\bUp to my last training\b",
                    r"\bWhile specific details are limited\b",
                    r"\bbased on available information\b"
                ],
                "weight": 5
            },
            "filler_phrases": {
                "keywords": [
                    r"\bIn order to\b", r"\bDue to the fact that\b",
                    r"\bAt this point in time\b", r"\bIn the event that\b",
                    r"\bhas the ability to\b", r"\bIt is important to note that\b"
                ],
                "weight": 1
            }
        }
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from a PDF file."""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            return f"Error extracting text: {str(e)}"
    
    def analyze_text(self, text: str) -> Dict:
        """Analyze text for AI writing patterns."""
        results = {
            "total_words": len(text.split()),
            "total_chars": len(text),
            "patterns_found": {},
            "total_matches": 0,
            "ai_score": 0.0
        }
        
        for pattern_name, pattern_data in self.patterns.items():
            matches = []
            for keyword in pattern_data["keywords"]:
                found = re.finditer(keyword, text, re.IGNORECASE)
                for match in found:
                    # Get context around the match
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end].replace('\n', ' ')
                    matches.append({
                        "text": match.group(),
                        "context": context,
                        "position": match.start()
                    })
            
            if matches:
                results["patterns_found"][pattern_name] = {
                    "count": len(matches),
                    "weight": pattern_data["weight"],
                    "weighted_score": len(matches) * pattern_data["weight"],
                    "examples": matches[:3]  # Show first 3 examples
                }
                results["total_matches"] += len(matches)
        
        # Calculate AI score (0-100%)
        # Normalize based on text length and pattern weights
        if results["total_words"] > 0:
            weighted_sum = sum(
                p["weighted_score"] 
                for p in results["patterns_found"].values()
            )
            # Normalize per 1000 words
            normalized_score = (weighted_sum / results["total_words"]) * 1000
            # Cap at 100%
            results["ai_score"] = min(100.0, normalized_score * 10)
        
        return results
    
    def generate_report(self, file_path: str, analysis: Dict) -> str:
        """Generate a human-readable report."""
        report = []
        report.append(f"\n{'='*80}")
        report.append(f"ANÁLISIS: {Path(file_path).name}")
        report.append(f"{'='*80}")
        report.append(f"\nEstadísticas del documento:")
        report.append(f"  - Palabras totales: {analysis['total_words']:,}")
        report.append(f"  - Caracteres totales: {analysis['total_chars']:,}")
        report.append(f"  - Patrones de IA detectados: {analysis['total_matches']}")
        report.append(f"\n🤖 PUNTUACIÓN DE IA: {analysis['ai_score']:.1f}%")
        
        if analysis['ai_score'] < 10:
            report.append("  ✅ Muy bajo - Probablemente escrito por humanos")
        elif analysis['ai_score'] < 25:
            report.append("  ⚠️  Bajo - Mayormente humano con algunos patrones de IA")
        elif analysis['ai_score'] < 50:
            report.append("  ⚠️  Moderado - Mezcla de escritura humana y de IA")
        elif analysis['ai_score'] < 75:
            report.append("  🚨 Alto - Probablemente generado por IA")
        else:
            report.append("  🚨 Muy alto - Casi con certeza generado por IA")
        
        if analysis["patterns_found"]:
            report.append(f"\n{'─'*80}")
            report.append("PATRONES DETECTADOS:")
            report.append(f"{'─'*80}")
            
            # Sort by weighted score
            sorted_patterns = sorted(
                analysis["patterns_found"].items(),
                key=lambda x: x[1]["weighted_score"],
                reverse=True
            )
            
            for pattern_name, data in sorted_patterns:
                pattern_title = pattern_name.replace('_', ' ').title()
                report.append(f"\n📌 {pattern_title}")
                report.append(f"   Ocurrencias: {data['count']}")
                report.append(f"   Puntuación ponderada: {data['weighted_score']:.1f}")
                
                if data["examples"]:
                    report.append(f"   Ejemplos:")
                    for i, example in enumerate(data["examples"], 1):
                        report.append(f"     {i}. \"{example['text']}\"")
                        report.append(f"        Contexto: ...{example['context']}...")
        else:
            report.append("\n✅ No se detectaron patrones significativos de IA")
        
        report.append(f"\n{'='*80}\n")
        return "\n".join(report)


def main():
    """Main execution function."""
    detector = AIPatternDetector()
    
    # Files to analyze
    files = [
        r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-1. Arquitecturas en la Nube Big Data (teoría complementaria).pdf",
        r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-1. Arquitecturas en la Nube Big Data.pdf",
        r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-2. Servicios en la nube (teoría complementaria).pdf",
        r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-2. Servicios en la Nube-slides.pdf",
        r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-3. Servicios gestionados de Big Data en AWS.pdf"
    ]
    
    all_reports = []
    summary_data = []
    
    print("\n🔍 Iniciando análisis de detección de IA en PDFs...")
    print("="*80)
    
    for file_path in files:
        if not Path(file_path).exists():
            print(f"\n⚠️  Archivo no encontrado: {Path(file_path).name}")
            continue
        
        print(f"\nProcesando: {Path(file_path).name}...")
        
        # Extract text
        text = detector.extract_text_from_pdf(file_path)
        
        if text.startswith("Error"):
            print(f"  ❌ {text}")
            continue
        
        # Analyze
        analysis = detector.analyze_text(text)
        
        # Generate report
        report = detector.generate_report(file_path, analysis)
        all_reports.append(report)
        
        summary_data.append({
            "file": Path(file_path).name,
            "score": analysis["ai_score"],
            "matches": analysis["total_matches"],
            "words": analysis["total_words"]
        })
        
        print(f"  ✅ Completado - Puntuación de IA: {analysis['ai_score']:.1f}%")
    
    # Print all reports
    print("\n\n")
    print("="*80)
    print("INFORMES DETALLADOS")
    print("="*80)
    for report in all_reports:
        print(report)
    
    # Print summary
    print("\n\n")
    print("="*80)
    print("RESUMEN GENERAL")
    print("="*80)
    print(f"\n{'Archivo':<60} {'Puntuación IA':>15}")
    print("─"*80)
    
    for item in sorted(summary_data, key=lambda x: x["score"], reverse=True):
        score_bar = "█" * int(item["score"] / 5)
        print(f"{item['file']:<60} {item['score']:>6.1f}% {score_bar}")
    
    avg_score = sum(item["score"] for item in summary_data) / len(summary_data) if summary_data else 0
    print("─"*80)
    print(f"{'PROMEDIO':<60} {avg_score:>6.1f}%")
    print("="*80)
    
    # Save to file
    output_file = Path(__file__).parent / "ai_detection_report.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(all_reports))
        f.write("\n\nRESUMEN GENERAL\n")
        f.write("="*80 + "\n")
        for item in summary_data:
            f.write(f"{item['file']}: {item['score']:.1f}%\n")
        f.write(f"\nPromedio: {avg_score:.1f}%\n")
    
    print(f"\n📄 Informe completo guardado en: {output_file}")


if __name__ == "__main__":
    main()
