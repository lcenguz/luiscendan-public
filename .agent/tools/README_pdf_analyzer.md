# 📄 PDF Analyzer - Documentación

Herramienta Python para leer, analizar y generar resúmenes HTML de PDFs académicos.

## 🚀 Instalación

```bash
# Instalar dependencias
pip install PyPDF2 pdfminer.six
```

Las dependencias se instalan automáticamente si no están presentes.

## 📖 Uso Básico

### 1. Analizar un PDF y generar HTML

```bash
python pdf_analyzer.py "ruta/al/documento.pdf"
```

Esto generará un archivo HTML con el mismo nombre que el PDF.

### 2. Especificar archivo de salida

```bash
python pdf_analyzer.py documento.pdf --output resumen.html
```

### 3. Extraer solo texto plano

```bash
python pdf_analyzer.py documento.pdf --text output.txt
```

### 4. Ver resumen rápido

```bash
python pdf_analyzer.py documento.pdf --summary
```

### 5. Ver estadísticas

```bash
python pdf_analyzer.py documento.pdf --stats
```

## 🔧 Opciones Avanzadas

### Métodos de Extracción

El script soporta dos métodos de extracción de texto:

- **`auto`** (por defecto): Prueba pdfminer primero, luego PyPDF2
- **`pdfminer`**: Mejor para PDFs complejos con múltiples columnas
- **`pypdf2`**: Más rápido, bueno para PDFs simples

```bash
python pdf_analyzer.py documento.pdf --method pdfminer
```

## 📊 Características

### Extracción de Texto
- Soporta múltiples métodos de extracción
- Limpieza automática de texto
- Manejo de PDFs complejos

### Análisis de Contenido
- Identificación automática de secciones
- Detección de títulos y subtítulos
- Estadísticas del documento

### Generación de HTML
- Diseño profesional con gradientes
- Estadísticas visuales (páginas, palabras, oraciones)
- Secciones organizadas
- Responsive design

## 💻 Uso Programático

También puedes usar la clase `PDFAnalyzer` en tus propios scripts:

```python
from pdf_analyzer import PDFAnalyzer

# Crear analizador
analyzer = PDFAnalyzer("documento.pdf")

# Extraer texto
text = analyzer.extract_text(method="auto")

# Obtener estadísticas
stats = analyzer.get_statistics()
print(f"Páginas: {stats['num_pages']}")
print(f"Palabras: {stats['num_words']}")

# Obtener secciones
sections = analyzer.get_sections()
for section in sections:
    print(f"Sección: {section['title']}")
    print(f"Contenido: {section['content'][:100]}...")

# Generar resumen
summary = analyzer.generate_summary(max_sentences=5)
print(summary)

# Guardar HTML
analyzer.generate_html("output.html", title="Mi Documento")

# Guardar texto plano
analyzer.save_text("output.txt")
```

## 📝 Ejemplos

### Ejemplo 1: Analizar PDF de la asignatura

```bash
cd c:\Github-Personal\luiscendan-private\estudios\master\tools

python pdf_analyzer.py "../1º_cuatrimestre/SM141500_Analisis_Informacion/teoria/UD1/UD1 Impacto del big data en los negocios y las organizaciones.pdf"
```

### Ejemplo 2: Procesar múltiples PDFs

```python
from pathlib import Path
from pdf_analyzer import PDFAnalyzer

# Directorio con PDFs
pdf_dir = Path("../1º_cuatrimestre/SM141500_Analisis_Informacion/teoria")
output_dir = Path("../1º_cuatrimestre/SM141500_Analisis_Informacion/apuntes")

# Procesar todos los PDFs
for pdf_file in pdf_dir.rglob("*.pdf"):
    print(f"Procesando: {pdf_file.name}")
    
    analyzer = PDFAnalyzer(str(pdf_file))
    analyzer.extract_text()
    
    # Generar HTML
    output_file = output_dir / f"{pdf_file.stem}.html"
    analyzer.generate_html(str(output_file))
    
    print(f"✅ Generado: {output_file.name}")
```

### Ejemplo 3: Crear resumen personalizado

```python
from pdf_analyzer import PDFAnalyzer

analyzer = PDFAnalyzer("documento.pdf")
analyzer.extract_text()

# Obtener secciones
sections = analyzer.get_sections()

# Crear resumen personalizado
print("# Resumen del Documento\n")
for i, section in enumerate(sections[:5], 1):
    print(f"## {i}. {section['title']}")
    
    # Primeras 2 oraciones de cada sección
    sentences = section['content'].split('.')[:2]
    print(' '.join(sentences) + '.\n')
```

## 🎨 Personalización del HTML

El HTML generado usa un diseño profesional con:
- Gradiente morado (667eea → 764ba2)
- Tarjetas de estadísticas
- Secciones con bordes de color
- Diseño responsive

Puedes modificar el método `generate_html()` en `pdf_analyzer.py` para personalizar el diseño.

## ⚠️ Limitaciones

- La extracción de texto puede no ser perfecta en PDFs escaneados (OCR no incluido)
- La detección de secciones es heurística y puede no funcionar en todos los PDFs
- PDFs con imágenes complejas o tablas pueden no extraerse correctamente

## 🔍 Troubleshooting

### Error: "No se pudo extraer texto del PDF"

Prueba con diferentes métodos:
```bash
python pdf_analyzer.py documento.pdf --method pypdf2
python pdf_analyzer.py documento.pdf --method pdfminer
```

### El HTML no muestra secciones

El PDF puede no tener títulos detectables. El script mostrará todo el contenido en una sola sección.

### Texto extraído tiene caracteres extraños

Algunos PDFs usan codificaciones especiales. El script intenta limpiar el texto automáticamente.

## 📚 Recursos

- [PyPDF2 Documentation](https://pypdf2.readthedocs.io/)
- [pdfminer.six Documentation](https://pdfminersix.readthedocs.io/)

## 🤝 Contribuciones

Este script es parte de las herramientas del Master en Big Data. Siéntete libre de mejorarlo y adaptarlo a tus necesidades.
