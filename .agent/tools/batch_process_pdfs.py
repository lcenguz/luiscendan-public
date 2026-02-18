"""
Batch PDF Processor - Procesa múltiples PDFs de forma automática
Útil para convertir todos los PDFs de teoría a HTML
"""

import os
from pathlib import Path
from pdf_analyzer import PDFAnalyzer


def process_directory(input_dir: str, output_dir: str, recursive: bool = True):
    """
    Procesa todos los PDFs en un directorio
    
    Args:
        input_dir: Directorio con PDFs
        output_dir: Directorio para HTMLs generados
        recursive: Si True, busca PDFs en subdirectorios
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    # Crear directorio de salida si no existe
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Buscar PDFs
    pattern = "**/*.pdf" if recursive else "*.pdf"
    pdf_files = list(input_path.glob(pattern))
    
    if not pdf_files:
        print(f"❌ No se encontraron PDFs en {input_dir}")
        return
    
    print(f"📄 Encontrados {len(pdf_files)} PDFs")
    print(f"📁 Directorio de salida: {output_dir}\n")
    
    # Procesar cada PDF
    success_count = 0
    error_count = 0
    
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"[{i}/{len(pdf_files)}] Procesando: {pdf_file.name}")
        
        try:
            # Crear analizador
            analyzer = PDFAnalyzer(str(pdf_file))
            
            # Extraer texto
            analyzer.extract_text(method="auto")
            
            if not analyzer.text:
                print(f"  ⚠️  No se pudo extraer texto")
                error_count += 1
                continue
            
            # Generar nombre de salida
            # Mantener estructura de subdirectorios si es recursivo
            if recursive:
                relative_path = pdf_file.relative_to(input_path)
                output_file = output_path / relative_path.with_suffix('.html')
                output_file.parent.mkdir(parents=True, exist_ok=True)
            else:
                output_file = output_path / f"{pdf_file.stem}.html"
            
            # Generar HTML
            analyzer.generate_html(str(output_file), title=pdf_file.stem)
            
            # Estadísticas
            stats = analyzer.get_statistics()
            print(f"  ✅ Generado: {output_file.name}")
            print(f"     {stats['num_pages']} páginas, {stats['num_words']:,} palabras\n")
            
            success_count += 1
            
        except Exception as e:
            print(f"  ❌ Error: {e}\n")
            error_count += 1
    
    # Resumen final
    print("\n" + "="*60)
    print(f"🎉 Procesamiento completado!")
    print(f"   ✅ Exitosos: {success_count}")
    print(f"   ❌ Errores: {error_count}")
    print(f"   📁 Archivos en: {output_dir}")
    print("="*60)


def process_subject(subject_name: str):
    """
    Procesa todos los PDFs de una asignatura específica
    
    Args:
        subject_name: Nombre de la asignatura (ej: 'SM141500_Analisis_Informacion')
    """
    base_dir = Path(__file__).parent.parent / "1º_cuatrimestre" / subject_name
    teoria_dir = base_dir / "teoria"
    apuntes_dir = base_dir / "apuntes"
    
    if not teoria_dir.exists():
        print(f"❌ No se encontró el directorio de teoría: {teoria_dir}")
        return
    
    print(f"📚 Procesando asignatura: {subject_name}")
    process_directory(str(teoria_dir), str(apuntes_dir), recursive=True)


def main():
    """Interfaz de línea de comandos"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Procesa múltiples PDFs y genera HTMLs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  # Procesar todos los PDFs de una asignatura
  python batch_process_pdfs.py --subject SM141500_Analisis_Informacion
  
  # Procesar un directorio específico
  python batch_process_pdfs.py --input teoria/ --output apuntes/
  
  # Procesar sin recursión (solo PDFs en el directorio raíz)
  python batch_process_pdfs.py --input teoria/ --output apuntes/ --no-recursive
        """
    )
    
    parser.add_argument('--subject', '-s', help='Nombre de la asignatura')
    parser.add_argument('--input', '-i', help='Directorio de entrada con PDFs')
    parser.add_argument('--output', '-o', help='Directorio de salida para HTMLs')
    parser.add_argument('--no-recursive', action='store_true', 
                       help='No buscar PDFs en subdirectorios')
    
    args = parser.parse_args()
    
    if args.subject:
        process_subject(args.subject)
    elif args.input and args.output:
        process_directory(args.input, args.output, recursive=not args.no_recursive)
    else:
        parser.print_help()
        print("\n💡 Tip: Usa --subject para procesar una asignatura completa")


if __name__ == "__main__":
    main()
