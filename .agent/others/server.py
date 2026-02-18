"""
Backend Flask para Dashboard Funcional de Agentes IA
Servidor que ejecuta los agentes y procesa las peticiones
"""

from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import re
from pathlib import Path
from datetime import datetime
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Configuración
AGENT_DIR = Path(__file__).parent
SKILLS_DIR = AGENT_DIR / "skills"
UPLOADS_DIR = AGENT_DIR / "uploads"
OUTPUTS_DIR = AGENT_DIR / "outputs"

# Crear directorios si no existen
UPLOADS_DIR.mkdir(exist_ok=True)
OUTPUTS_DIR.mkdir(exist_ok=True)

# ============================================================================
# UTILIDADES
# ============================================================================

def parse_skill_frontmatter(skill_path):
    """Extrae información del frontmatter YAML de un SKILL.md"""
    skill_file = skill_path / "SKILL.md"
    if not skill_file.exists():
        return None
    
    with open(skill_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL | re.MULTILINE)
    if not match:
        return None
    
    frontmatter = match.group(1)
    
    name = re.search(r'name:\s*(.+)', frontmatter)
    version = re.search(r'version:\s*(.+)', frontmatter)
    description = re.search(r'description:\s*\|\s*\n((?:\s+.+\n?)+)', frontmatter)
    
    return {
        'name': name.group(1).strip() if name else 'Unknown',
        'version': version.group(1).strip() if version else '0.0.0',
        'description': description.group(1).strip() if description else 'Sin descripción',
        'path': skill_path.name
    }

def get_all_agents():
    """Obtiene información de todos los agentes"""
    agents = []
    
    if not SKILLS_DIR.exists():
        return agents
    
    for skill_dir in SKILLS_DIR.iterdir():
        if skill_dir.is_dir():
            agent_info = parse_skill_frontmatter(skill_dir)
            if agent_info:
                agents.append(agent_info)
    
    return agents

# ============================================================================
# AGENTE: HUMANIZER
# ============================================================================

def humanize_text(text):
    """Aplica reglas de humanización al texto"""
    
    # Patrones a reemplazar
    patterns = {
        # Copula avoidance
        r'\bserves as\b': 'is',
        r'\bstands as\b': 'is',
        r'\bboasts\b': 'has',
        r'\bfeatures\b': 'has',
        
        # AI vocabulary
        r'\bAdditionally,\s*': '',
        r'\bMoreover,\s*': '',
        r'\bcrucial\b': 'important',
        r'\bpivotal\b': 'key',
        r'\blandscape\b(?! of)': 'field',
        r'\btestament to\b': 'shows',
        r'\bshowcasing\b': 'showing',
        r'\bhighlighting\b': 'showing',
        r'\bunderscoring\b': 'emphasizing',
        
        # Promotional language
        r'\bnestled in\b': 'in',
        r'\bvibrant\b': '',
        r'\brich\b(?! in)': '',
        r'\bstunning\b': '',
        r'\bbreathtaking\b': '',
        
        # Em dashes
        r'—': ',',
        
        # Filler phrases
        r'\bin order to\b': 'to',
        r'\bdue to the fact that\b': 'because',
        r'\bat this point in time\b': 'now',
        r'\bin the event that\b': 'if',
    }
    
    result = text
    changes = []
    
    for pattern, replacement in patterns.items():
        matches = re.findall(pattern, result, re.IGNORECASE)
        if matches:
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
            changes.append(f"Reemplazado '{matches[0]}' → '{replacement}'")
    
    # Limpiar espacios múltiples
    result = re.sub(r'\s+', ' ', result)
    result = re.sub(r'\s+([.,;:])', r'\1', result)
    
    return {
        'original': text,
        'humanized': result.strip(),
        'changes': changes,
        'stats': {
            'original_length': len(text),
            'humanized_length': len(result),
            'changes_count': len(changes)
        }
    }

# ============================================================================
# AGENTE: CHARACTER DESIGN
# ============================================================================

def analyze_image_for_character(image_data):
    """Analiza una imagen y genera un prompt adaptado"""
    # Por ahora, genera un prompt base
    # TODO: Integrar con API de análisis de imagen
    
    prompt = {
        "subject": {
            "type": "chibi-style 3D character",
            "gender": "detected from image",
            "features": {
                "hair": "analyzed from uploaded image",
                "eyes": "large expressive eyes",
                "expression": "friendly and approachable",
                "skin": "fair with soft blush",
                "accessories": []
            },
            "outfit": {
                "top": "casual modern style",
                "bottom": "comfortable pants",
                "shoes": "sneakers"
            }
        },
        "art_style": {
            "type": "3D render / C4D / Octane Render",
            "aesthetic": "soft claymorphism, smooth textures",
            "lighting": "soft cinematic lighting",
            "camera": "full body shot, eye-level"
        },
        "environment": {
            "background": "blurred modern setting",
            "color_palette": ["pastel pink", "peach", "warm brown", "cream"]
        }
    }
    
    return json.dumps(prompt, indent=2)

# ============================================================================
# AGENTE: ACADEMIC WRITER
# ============================================================================

def analyze_academic_text(text):
    """Analiza un texto académico y proporciona feedback"""
    
    issues = []
    suggestions = []
    
    # Verificar estructura básica
    has_intro = bool(re.search(r'introducci[oó]n|introduction', text, re.IGNORECASE))
    has_conclusion = bool(re.search(r'conclusi[oó]n|conclusion', text, re.IGNORECASE))
    
    if not has_intro:
        issues.append("❌ No se detectó una introducción clara")
        suggestions.append("Añade una sección de introducción con contexto y objetivos")
    
    if not has_conclusion:
        issues.append("❌ No se detectó una conclusión")
        suggestions.append("Añade una conclusión que sintetice los hallazgos")
    
    # Verificar primera persona excesiva
    first_person = len(re.findall(r'\b(yo|mi|mis|nosotros)\b', text, re.IGNORECASE))
    if first_person > 5:
        issues.append(f"⚠️ Uso excesivo de primera persona ({first_person} veces)")
        suggestions.append("Reduce el uso de primera persona en textos académicos")
    
    # Verificar lenguaje coloquial
    colloquial = re.findall(r'\b(un montón|bastante|muy muy|super|genial)\b', text, re.IGNORECASE)
    if colloquial:
        issues.append(f"⚠️ Lenguaje coloquial detectado: {', '.join(set(colloquial))}")
        suggestions.append("Usa lenguaje más formal y académico")
    
    # Verificar longitud de párrafos
    paragraphs = text.split('\n\n')
    long_paragraphs = [i for i, p in enumerate(paragraphs) if len(p) > 1000]
    if long_paragraphs:
        issues.append(f"⚠️ Párrafos muy largos detectados")
        suggestions.append("Divide párrafos largos para mejorar legibilidad")
    
    # Calcular estadísticas
    words = len(text.split())
    sentences = len(re.findall(r'[.!?]+', text))
    avg_sentence_length = words / sentences if sentences > 0 else 0
    
    return {
        'issues': issues,
        'suggestions': suggestions,
        'stats': {
            'words': words,
            'sentences': sentences,
            'paragraphs': len(paragraphs),
            'avg_sentence_length': round(avg_sentence_length, 1),
            'has_intro': has_intro,
            'has_conclusion': has_conclusion
        }
    }

# ============================================================================
# RUTAS API
# ============================================================================

@app.route('/')
def index():
    """Página principal del dashboard"""
    return send_file('dashboard-functional.html')

@app.route('/api/agents')
def api_agents():
    """Obtiene lista de agentes"""
    agents = get_all_agents()
    return jsonify(agents)

@app.route('/api/humanize', methods=['POST'])
def api_humanize():
    """Humaniza un texto"""
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    result = humanize_text(text)
    
    # Guardar resultado
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = OUTPUTS_DIR / f'humanized_{timestamp}.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(result['humanized'])
    
    result['output_file'] = str(output_file)
    
    return jsonify(result)

@app.route('/api/character-design', methods=['POST'])
def api_character_design():
    """Genera prompt de character design desde imagen"""
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image']
    
    # Guardar imagen
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    image_path = UPLOADS_DIR / f'character_{timestamp}_{image.filename}'
    image.save(image_path)
    
    # Analizar imagen y generar prompt
    prompt = analyze_image_for_character(image_path)
    
    # Guardar prompt
    prompt_file = OUTPUTS_DIR / f'prompt_{timestamp}.json'
    with open(prompt_file, 'w', encoding='utf-8') as f:
        f.write(prompt)
    
    return jsonify({
        'prompt': prompt,
        'image_path': str(image_path),
        'prompt_file': str(prompt_file)
    })

@app.route('/api/academic-review', methods=['POST'])
def api_academic_review():
    """Revisa un texto académico"""
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    result = analyze_academic_text(text)
    
    return jsonify(result)

@app.route('/api/execute-prompt', methods=['POST'])
def api_execute_prompt():
    """Ejecuta un prompt y genera una imagen"""
    data = request.json
    prompt = data.get('prompt', '')
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    # Guardar el prompt
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    prompt_file = OUTPUTS_DIR / f'executed_prompt_{timestamp}.txt'
    with open(prompt_file, 'w', encoding='utf-8') as f:
        f.write(prompt)
    
    # Nota: Aquí se integraría con la API de Gemini/DALL-E
    # Por ahora, retornamos el prompt formateado
    result = {
        'prompt': prompt,
        'prompt_file': str(prompt_file),
        'status': 'ready',
        'message': 'Prompt guardado. Copia el prompt y úsalo en Gemini, DALL-E o Midjourney.',
        'instructions': [
            '1. Copia el prompt de abajo',
            '2. Ve a https://gemini.google.com o https://labs.openai.com',
            '3. Pega el prompt en el generador de imágenes',
            '4. Genera tu imagen'
        ]
    }
    
    return jsonify(result)

@app.route('/api/prompts/categories')
def api_prompts_categories():
    """Obtiene las categorías de prompts disponibles"""
    categories = [
        {'id': 'character-design', 'name': 'Character Design', 'icon': '👤'},
        {'id': 'product-photography', 'name': 'Product Photography', 'icon': '📸'},
        {'id': '3d-render', 'name': '3D Render', 'icon': '🎨'},
        {'id': 'fashion', 'name': 'Fashion', 'icon': '👗'},
        {'id': 'food', 'name': 'Food', 'icon': '🍔'},
        {'id': 'architecture', 'name': 'Architecture', 'icon': '🏛️'},
        {'id': 'cinematic', 'name': 'Cinematic', 'icon': '🎬'},
        {'id': 'nature', 'name': 'Nature', 'icon': '🌲'},
        {'id': 'tech', 'name': 'Tech', 'icon': '💻'},
        {'id': 'fantasy', 'name': 'Fantasy', 'icon': '🐉'},
    ]
    return jsonify(categories)

@app.route('/api/prompts/examples')
def api_prompts_examples():
    """Obtiene ejemplos de prompts por categoría"""
    examples = {
        'character-design': [
            'Chibi-style 3D character with pastel pink hair, large expressive eyes, modern casual outfit, soft claymorphism aesthetic, C4D render',
            'Photorealistic portrait of a young woman with curly hair, natural lighting, studio setting, professional photography',
            'Anime-style character with vibrant blue hair, fantasy outfit, magical background, digital art'
        ],
        'product-photography': [
            'Professional product photography of a beverage can with water splash, dynamic lighting, studio setup, commercial quality',
            'Luxury watch on marble surface, dramatic lighting, high-end product photography, 8K resolution',
            'Smartphone floating with holographic UI elements, futuristic tech ad, clean background'
        ],
        '3d-render': [
            '3D isometric miniature cityscape with weather effects, detailed architecture, Blender render',
            'Cute 3D claymation character in a whimsical scene, soft lighting, pastel colors',
            'Photorealistic 3D render of a modern living room, architectural visualization'
        ],
        'food': [
            'Gourmet burger with fresh ingredients, food photography, appetizing presentation, professional lighting',
            'Exploded view of a layered cake, detailed food illustration, vibrant colors',
            'Miniature cooking scene with tiny chef, creative food art, macro photography'
        ]
    }
    
    category = request.args.get('category', 'character-design')
    return jsonify({
        'category': category,
        'examples': examples.get(category, examples['character-design'])
    })

@app.route('/api/stats')
def api_stats():
    """Obtiene estadísticas del sistema"""
    agents = get_all_agents()
    file_count = sum(1 for _ in AGENT_DIR.rglob('*') if _.is_file())
    
    return jsonify({
        'agent_count': len(agents),
        'file_count': file_count,
        'uploads_count': len(list(UPLOADS_DIR.glob('*'))),
        'outputs_count': len(list(OUTPUTS_DIR.glob('*'))),
        'last_update': datetime.now().isoformat()
    })

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("DASHBOARD FUNCIONAL DE AGENTES IA")
    print("=" * 60)
    print()
    print("Servidor iniciado en: http://localhost:5000")
    print("Directorio de agentes:", AGENT_DIR)
    print("Uploads:", UPLOADS_DIR)
    print("Outputs:", OUTPUTS_DIR)
    print()
    print("Presiona Ctrl+C para detener")
    print("=" * 60)
    print()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
