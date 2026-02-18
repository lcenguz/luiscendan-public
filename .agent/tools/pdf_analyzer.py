"""
PDF Analyzer - Herramienta para leer y analizar PDFs académicos
Extrae texto, genera resúmenes y crea HTMLs con formato profesional
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Optional
import re

try:
    import PyPDF2
except ImportError:
    print("⚠️  PyPDF2 no está instalado. Instalando...")
    os.system("pip install PyPDF2")
    import PyPDF2

try:
    from pdfminer.high_level import extract_text as pdfminer_extract
    from pdfminer.layout import LAParams
except ImportError:
    print("⚠️  pdfminer.six no está instalado. Instalando...")
    os.system("pip install pdfminer.six")
    from pdfminer.high_level import extract_text as pdfminer_extract
    from pdfminer.layout import LAParams


class PDFAnalyzer:
    """Analizador de PDFs con múltiples métodos de extracción"""
    
    def __init__(self, pdf_path: str):
        self.pdf_path = Path(pdf_path)
        if not self.pdf_path.exists():
            raise FileNotFoundError(f"PDF no encontrado: {pdf_path}")
        
        self.text = ""
        self.metadata = {}
        self.num_pages = 0
        
    def extract_text_pypdf2(self) -> str:
        """Extrae texto usando PyPDF2"""
        text = []
        try:
            with open(self.pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                self.num_pages = len(pdf_reader.pages)
                self.metadata = pdf_reader.metadata or {}
                
                for page_num, page in enumerate(pdf_reader.pages, 1):
                    page_text = page.extract_text()
                    if page_text:
                        text.append(f"\n--- Página {page_num} ---\n")
                        text.append(page_text)
        except Exception as e:
            print(f"❌ Error con PyPDF2: {e}")
            return ""
        
        return "\n".join(text)
    
    def extract_text_pdfminer(self) -> str:
        """Extrae texto usando pdfminer (mejor para PDFs complejos)"""
        try:
            laparams = LAParams(
                line_margin=0.5,
                word_margin=0.1,
                char_margin=2.0,
                boxes_flow=0.5
            )
            text = pdfminer_extract(str(self.pdf_path), laparams=laparams)
            return text
        except Exception as e:
            print(f"❌ Error con pdfminer: {e}")
            return ""
    
    def extract_text(self, method: str = "auto") -> str:
        """
        Extrae texto del PDF usando el método especificado
        
        Args:
            method: 'pypdf2', 'pdfminer', o 'auto' (prueba ambos)
        """
        if method == "pypdf2":
            self.text = self.extract_text_pypdf2()
        elif method == "pdfminer":
            self.text = self.extract_text_pdfminer()
        else:  # auto
            # Intenta pdfminer primero (mejor calidad)
            self.text = self.extract_text_pdfminer()
            if not self.text or len(self.text) < 100:
                # Si falla, intenta PyPDF2
                self.text = self.extract_text_pypdf2()
        
        return self.text
    
    def clean_text(self) -> str:
        """Limpia el texto extraído"""
        text = self.text
        
        # Eliminar múltiples espacios
        text = re.sub(r'\s+', ' ', text)
        
        # Eliminar múltiples saltos de línea
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Eliminar caracteres extraños
        text = text.replace('\x00', '')
        
        return text.strip()
    
    def get_sections(self) -> List[Dict[str, str]]:
        """
        Intenta identificar secciones del documento
        Busca patrones como números, títulos en mayúsculas, etc.
        """
        text = self.clean_text()
        sections = []
        
        # Patrones comunes de títulos
        patterns = [
            r'\n\d+\.\s+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+)\n',  # "1. TÍTULO"
            r'\n([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{10,})\n',      # "TÍTULO LARGO"
            r'\n\d+\.\d+\s+([A-Z][a-záéíóúñ\s]+)\n',     # "1.1 Título"
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                title = match.group(1).strip()
                start = match.end()
                sections.append({
                    'title': title,
                    'start': start
                })
        
        # Ordenar por posición
        sections.sort(key=lambda x: x['start'])
        
        # Extraer contenido de cada sección
        for i, section in enumerate(sections):
            start = section['start']
            end = sections[i + 1]['start'] if i + 1 < len(sections) else len(text)
            section['content'] = text[start:end].strip()
        
        return sections
    
    def get_statistics(self) -> Dict[str, any]:
        """Obtiene estadísticas del documento"""
        text = self.clean_text()
        
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        
        return {
            'num_pages': self.num_pages,
            'num_characters': len(text),
            'num_words': len(words),
            'num_sentences': len([s for s in sentences if s.strip()]),
            'avg_words_per_sentence': len(words) / max(len(sentences), 1),
        }
    
    def generate_summary(self, max_sentences: int = 10) -> str:
        """
        Genera un resumen simple del documento
        Toma las primeras oraciones de cada sección
        """
        sections = self.get_sections()
        summary_parts = []
        
        if sections:
            for section in sections[:5]:  # Primeras 5 secciones
                title = section['title']
                content = section['content']
                
                # Tomar primera oración
                sentences = re.split(r'[.!?]+', content)
                first_sentence = sentences[0].strip() if sentences else ""
                
                if first_sentence:
                    summary_parts.append(f"**{title}**: {first_sentence}.")
        else:
            # Si no hay secciones, tomar primeras oraciones del texto
            text = self.clean_text()
            sentences = re.split(r'[.!?]+', text)
            summary_parts = [s.strip() + "." for s in sentences[:max_sentences] if s.strip()]
        
        return "\n\n".join(summary_parts)
    
    def save_text(self, output_path: str):
        """Guarda el texto extraído en un archivo"""
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(self.clean_text())
        print(f"✅ Texto guardado en: {output_path}")
    
    def generate_html(self, output_path: str, title: Optional[str] = None):
        """Genera un HTML con formato profesional"""
        if not title:
            title = self.pdf_path.stem
        
        sections = self.get_sections()
        stats = self.get_statistics()
        
        # Generar contenido HTML
        sections_html = ""
        if sections:
            for section in sections:
                section_title = section['title']
                section_content = section['content']
                
                # Convertir párrafos
                paragraphs = section_content.split('\n\n')
                paragraphs_html = "".join([f"<p>{p.strip()}</p>" for p in paragraphs if p.strip()])
                
                sections_html += f"""
            <div class="section">
                <h2>{section_title}</h2>
                {paragraphs_html}
            </div>
            """
        else:
            # Si no hay secciones, usar todo el texto
            text = self.clean_text()
            paragraphs = text.split('\n\n')
            paragraphs_html = "".join([f"<p>{p.strip()}</p>" for p in paragraphs if p.strip()])
            sections_html = f"""
            <div class="section">
                <h2>Contenido</h2>
                {paragraphs_html}
            </div>
            """
        
        html_template = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.8;
            padding: 20px;
        }}
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }}
        header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 50px;
            text-align: center;
        }}
        header h1 {{ font-size: 3em; margin-bottom: 15px; }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px 50px;
            background: #f8f9fa;
        }}
        .stat-card {{
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }}
        .stat-card h3 {{ color: #667eea; font-size: 2em; }}
        .stat-card p {{ color: #666; margin-top: 10px; }}
        .content {{ padding: 50px; }}
        .section {{
            margin-bottom: 40px;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 15px;
            border-left: 6px solid #667eea;
        }}
        .section h2 {{ color: #667eea; font-size: 2em; margin-bottom: 20px; }}
        .section p {{ margin-bottom: 15px; text-align: justify; }}
        footer {{
            background: #2d3436;
            color: white;
            text-align: center;
            padding: 25px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📄 {title}</h1>
            <p>Análisis automático de PDF</p>
        </header>

        <div class="stats">
            <div class="stat-card">
                <h3>{stats['num_pages']}</h3>
                <p>Páginas</p>
            </div>
            <div class="stat-card">
                <h3>{stats['num_words']:,}</h3>
                <p>Palabras</p>
            </div>
            <div class="stat-card">
                <h3>{stats['num_sentences']:,}</h3>
                <p>Oraciones</p>
            </div>
            <div class="stat-card">
                <h3>{stats['avg_words_per_sentence']:.1f}</h3>
                <p>Palabras/Oración</p>
            </div>
        </div>

        <div class="content">
            {sections_html}
        </div>

        <footer>
            <p>📄 Generado automáticamente por PDF Analyzer - {self.pdf_path.name}</p>
        </footer>
    </div>
</body>
</html>"""
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_template)
        
        print(f"✅ HTML generado en: {output_path}")


def main():
    """Función principal con interfaz de línea de comandos"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Analiza PDFs y genera resúmenes en HTML",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  # Analizar un PDF y generar HTML
  python pdf_analyzer.py documento.pdf
  
  # Analizar y guardar texto plano
  python pdf_analyzer.py documento.pdf --text output.txt
  
  # Usar método específico de extracción
  python pdf_analyzer.py documento.pdf --method pdfminer
  
  # Generar solo resumen
  python pdf_analyzer.py documento.pdf --summary
        """
    )
    
    parser.add_argument('pdf_path', help='Ruta al archivo PDF')
    parser.add_argument('--output', '-o', help='Ruta del archivo HTML de salida')
    parser.add_argument('--text', '-t', help='Guardar texto plano en este archivo')
    parser.add_argument('--method', '-m', choices=['auto', 'pypdf2', 'pdfminer'], 
                       default='auto', help='Método de extracción')
    parser.add_argument('--summary', '-s', action='store_true', 
                       help='Mostrar solo resumen')
    parser.add_argument('--stats', action='store_true', 
                       help='Mostrar estadísticas')
    
    args = parser.parse_args()
    
    # Crear analizador
    print(f"📄 Analizando: {args.pdf_path}")
    analyzer = PDFAnalyzer(args.pdf_path)
    
    # Extraer texto
    print(f"🔍 Extrayendo texto (método: {args.method})...")
    analyzer.extract_text(method=args.method)
    
    if not analyzer.text:
        print("❌ No se pudo extraer texto del PDF")
        return
    
    print(f"✅ Texto extraído: {len(analyzer.text)} caracteres")
    
    # Mostrar estadísticas
    if args.stats or args.summary:
        stats = analyzer.get_statistics()
        print("\n📊 Estadísticas:")
        print(f"  - Páginas: {stats['num_pages']}")
        print(f"  - Palabras: {stats['num_words']:,}")
        print(f"  - Oraciones: {stats['num_sentences']:,}")
        print(f"  - Promedio palabras/oración: {stats['avg_words_per_sentence']:.1f}")
    
    # Mostrar resumen
    if args.summary:
        print("\n📝 Resumen:")
        print(analyzer.generate_summary())
        return
    
    # Guardar texto plano
    if args.text:
        analyzer.save_text(args.text)
    
    # Generar HTML
    if not args.text or args.output:
        output_path = args.output or args.pdf_path.replace('.pdf', '.html')
        analyzer.generate_html(output_path)
        print(f"\n🎉 ¡Análisis completado!")
        print(f"   Abre el archivo HTML para ver el resultado: {output_path}")


if __name__ == "__main__":
    # Si se ejecuta sin argumentos, mostrar ayuda
    if len(sys.argv) == 1:
        print("📄 PDF Analyzer - Herramienta de análisis de PDFs\n")
        print("Uso básico:")
        print("  python pdf_analyzer.py <archivo.pdf>")
        print("\nPara más opciones:")
        print("  python pdf_analyzer.py --help")
    else:
        main()
