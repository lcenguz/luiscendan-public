import subprocess
import sys
import pkg_resources

def instalar_dependencias():
    """Verifica e instala las librerías necesarias automáticamente."""
    librerias = {
        "pymupdf": "fitz",
        "pdfplumber": "pdfplumber",
        "pytesseract": "pytesseract",
        "pdf2image": "pdf2image"
    }
    
    instaladas = {pkg.key for pkg in pkg_resources.working_set}
    
    for lib_nombre, import_nombre in librerias.items():
        if lib_nombre not in instaladas:
            print(f"📦 Instalando {lib_nombre}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", lib_nombre])
        else:
            print(f"✅ {lib_nombre} ya está lista.")

# Ejecutar la instalación antes de importar el resto
instalar_dependencias()

# Ahora importamos las librerías ya instaladas
import fitz  # PyMuPDF
import pdfplumber
import pytesseract
from pdf2image import convert_from_path

class LectorPDFInteligente:
    def __init__(self, ruta_pdf):
        self.ruta = ruta_pdf

    def extraer_texto_digital(self):
        """Lee texto de PDFs creados digitalmente (Word, Excel, etc.)"""
        texto = ""
        with fitz.open(self.ruta) as doc:
            for pagina in doc:
                texto += pagina.get_text()
        return texto

    def extraer_tablas(self):
        """Busca tablas y las devuelve como listas."""
        with pdfplumber.open(self.ruta) as pdf:
            return [pag.extract_table() for pag in pdf.pages if pag.extract_table()]

    def extraer_ocr(self):
        """Convierte a imagen y usa OCR para PDFs escaneados (fotos)."""
        # Nota: Requiere tener instalado Tesseract-OCR en el sistema
        imagenes = convert_from_path(self.ruta)
        texto_ocr = ""
        for i, img in enumerate(imagenes):
            texto_ocr += f"\n--- Pág {i+1} ---\n" + pytesseract.image_to_string(img, lang='spa')
        return texto_ocr

    def procesar(self):
        """Decide qué método usar según el contenido."""
        print(f"📄 Analizando: {self.ruta}")
        texto = self.extraer_texto_digital()
        
        if len(texto.strip()) < 50:
            print("🔍 No se detectó texto digital. Iniciando OCR...")
            return self.extraer_ocr()
        
        print("💡 Texto digital extraído con éxito.")
        return texto

# --- PRUEBA DEL SCRIPT ---
if __name__ == "__main__":
    # Cambia 'mi_archivo.pdf' por el nombre de tu archivo
    ruta = "tu_documento.pdf" 
    try:
        lector = LectorPDFInteligente(ruta)
        resultado = lector.procesar()
        print("\nCONTENIDO EXTRAÍDO:\n", resultado[:1000], "...") # Muestra los primeros 1000 caracteres
    except Exception as e:
        print(f"❌ Error: {e}")
