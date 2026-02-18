"""
Script para extraer texto de los PDFs del caso FinTech y materiales teóricos
"""
import sys
sys.path.append('c:\\Github-Personal\\luiscendan-private\\.agent\\scripts')

from pdf_reader import LectorPDFInteligente
import os

# Rutas de los PDFs
pdfs = {
    "caso": r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\Entregas\Caso_D_FinTech_Version_Alumno_con_Rubrica.pdf",
    "unidad1": r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-1. Arquitecturas en la Nube Big Data.pdf",
    "unidad1_comp": r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-1. Arquitecturas en la Nube Big Data (teoría complementaria).pdf",
    "unidad2": r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-2. Servicios en la Nube-slides.pdf",
    "unidad2_comp": r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-2. Servicios en la nube (teoría complementaria).pdf",
    "unidad3": r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\teoria\UNIDAD-3. Servicios gestionados de Big Data en AWS.pdf"
}

# Directorio de salida
output_dir = r"c:\Github-Personal\luiscendan-private\estudios\master\1º_cuatrimestre\SM141503_Plat_Tecnologicas_Cloud\Entregas\extracted_content"
os.makedirs(output_dir, exist_ok=True)

# Extraer texto de cada PDF
for nombre, ruta in pdfs.items():
    print(f"\n{'='*60}")
    print(f"Procesando: {nombre}")
    print(f"{'='*60}")
    
    try:
        lector = LectorPDFInteligente(ruta)
        texto = lector.procesar()
        
        # Guardar en archivo de texto
        output_file = os.path.join(output_dir, f"{nombre}.txt")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(texto)
        
        print(f"✅ Guardado en: {output_file}")
        print(f"📊 Caracteres extraídos: {len(texto)}")
        
    except Exception as e:
        print(f"❌ Error procesando {nombre}: {e}")

print(f"\n{'='*60}")
print("✨ Proceso completado")
print(f"{'='*60}")
