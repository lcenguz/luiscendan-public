"""
Generador de Resumen HTML para .agent

Este script genera automáticamente un resumen HTML de todo el contenido
en el directorio .agent (skills, workflows, knowledge, etc.)
"""

import os
from pathlib import Path
from datetime import datetime
import re

def get_frontmatter(file_path):
    """Extrae el frontmatter YAML de un archivo markdown."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    return parts[1].strip()
    except:
        pass
    return None

def extract_description(frontmatter):
    """Extrae la descripción del frontmatter."""
    if frontmatter:
        match = re.search(r'description:\s*(.+)', frontmatter)
        if match:
            return match.group(1).strip()
    return "Sin descripción"

def scan_skills(agent_dir):
    """Escanea el directorio de skills."""
    skills_dir = agent_dir / 'skills'
    skills = []
    
    if skills_dir.exists():
        for skill_folder in skills_dir.iterdir():
            if skill_folder.is_dir():
                skill_file = skill_folder / 'SKILL.md'
                if skill_file.exists():
                    frontmatter = get_frontmatter(skill_file)
                    description = extract_description(frontmatter)
                    skills.append({
                        'name': skill_folder.name,
                        'description': description,
                        'path': str(skill_file.relative_to(agent_dir))
                    })
    
    return skills

def scan_workflows(agent_dir):
    """Escanea el directorio de workflows."""
    workflows_dir = agent_dir / 'workflows'
    workflows = []
    
    if workflows_dir.exists():
        for workflow_file in workflows_dir.glob('*.md'):
            frontmatter = get_frontmatter(workflow_file)
            description = extract_description(frontmatter)
            workflows.append({
                'name': workflow_file.stem,
                'description': description,
                'path': str(workflow_file.relative_to(agent_dir))
            })
    
    return workflows

def scan_knowledge(agent_dir):
    """Escanea el directorio de knowledge."""
    knowledge_dir = agent_dir / 'knowledge'
    knowledge_files = []
    
    if knowledge_dir.exists():
        for knowledge_file in knowledge_dir.glob('*.md'):
            # Leer primeras líneas para obtener título
            try:
                with open(knowledge_file, 'r', encoding='utf-8') as f:
                    first_line = f.readline().strip()
                    title = first_line.replace('#', '').strip() if first_line.startswith('#') else knowledge_file.stem
            except:
                title = knowledge_file.stem
            
            knowledge_files.append({
                'name': knowledge_file.stem,
                'title': title,
                'path': str(knowledge_file.relative_to(agent_dir))
            })
    
    return knowledge_files

def scan_tools(agent_dir):
    """Escanea el directorio de tools."""
    tools_dir = agent_dir / 'tools'
    tools = []
    
    if tools_dir.exists():
        for tool_file in tools_dir.glob('*.py'):
            if tool_file.name == '__init__.py':
                continue
            
            # Leer docstring del archivo
            description = "Sin descripción"
            try:
                with open(tool_file, 'r', encoding='utf-8') as f:
                    content = f.read(500)  # Primeros 500 caracteres
                    # Buscar docstring
                    if '"""' in content:
                        parts = content.split('"""')
                        if len(parts) >= 2:
                            description = parts[1].strip().split('\n')[0]
            except:
                pass
            
            tools.append({
                'name': tool_file.stem,
                'description': description,
                'path': str(tool_file.relative_to(agent_dir))
            })
    
    return tools

def get_file_stats(agent_dir):
    """Obtiene estadísticas del directorio .agent."""
    stats = {
        'total_files': 0,
        'total_size': 0,
        'file_types': {}
    }
    
    for file_path in agent_dir.rglob('*'):
        if file_path.is_file():
            stats['total_files'] += 1
            stats['total_size'] += file_path.stat().st_size
            
            ext = file_path.suffix or 'sin extensión'
            stats['file_types'][ext] = stats['file_types'].get(ext, 0) + 1
    
    return stats

def generate_html(agent_dir, output_file):
    """Genera el archivo HTML con el resumen."""
    
    skills = scan_skills(agent_dir)
    workflows = scan_workflows(agent_dir)
    knowledge = scan_knowledge(agent_dir)
    tools = scan_tools(agent_dir)
    stats = get_file_stats(agent_dir)
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumen .agent - {datetime.now().strftime('%Y-%m-%d %H:%M')}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }}
        
        .header .timestamp {{
            opacity: 0.9;
            font-size: 0.9rem;
        }}
        
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            padding: 2rem;
            background: #f8f9fa;
        }}
        
        .stat-card {{
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }}
        
        .stat-card .number {{
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 0.5rem;
        }}
        
        .stat-card .label {{
            color: #666;
            font-size: 0.9rem;
        }}
        
        .content {{
            padding: 2rem;
        }}
        
        .section {{
            margin-bottom: 3rem;
        }}
        
        .section h2 {{
            color: #333;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #667eea;
            font-size: 1.8rem;
        }}
        
        .card {{
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 5px;
            transition: transform 0.2s, box-shadow 0.2s;
        }}
        
        .card:hover {{
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}
        
        .card h3 {{
            color: #667eea;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }}
        
        .card p {{
            color: #666;
            line-height: 1.6;
        }}
        
        .card .path {{
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            color: #999;
            margin-top: 0.5rem;
        }}
        
        .empty-state {{
            text-align: center;
            padding: 2rem;
            color: #999;
            font-style: italic;
        }}
        
        .footer {{
            background: #f8f9fa;
            padding: 1.5rem;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 Resumen del Directorio .agent</h1>
            <p class="timestamp">Generado el {datetime.now().strftime('%d/%m/%Y a las %H:%M:%S')}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="number">{len(skills)}</div>
                <div class="label">Skills</div>
            </div>
            <div class="stat-card">
                <div class="number">{len(workflows)}</div>
                <div class="label">Workflows</div>
            </div>
            <div class="stat-card">
                <div class="number">{len(knowledge)}</div>
                <div class="label">Knowledge Files</div>
            </div>
            <div class="stat-card">
                <div class="number">{len(tools)}</div>
                <div class="label">Tools</div>
            </div>
            <div class="stat-card">
                <div class="number">{stats['total_files']}</div>
                <div class="label">Total Files</div>
            </div>
        </div>
        
        <div class="content">
            <!-- Skills Section -->
            <div class="section">
                <h2>🛠️ Skills</h2>
                {generate_skills_html(skills)}
            </div>
            
            <!-- Workflows Section -->
            <div class="section">
                <h2>⚙️ Workflows</h2>
                {generate_workflows_html(workflows)}
            </div>
            
            <!-- Knowledge Section -->
            <div class="section">
                <h2>📖 Knowledge Base</h2>
                {generate_knowledge_html(knowledge)}
            </div>
            
            <!-- Tools Section -->
            <div class="section">
                <h2>🔧 Tools</h2>
                {generate_tools_html(tools)}
            </div>
        </div>
        
        <div class="footer">
            <p>Generado automáticamente por generate-agent-summary.py</p>
        </div>
    </div>
</body>
</html>
"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ Resumen HTML generado: {output_file}")

def generate_skills_html(skills):
    """Genera HTML para la sección de skills."""
    if not skills:
        return '<div class="empty-state">No hay skills configurados</div>'
    
    html = ""
    for skill in skills:
        html += f"""
        <div class="card">
            <h3>{skill['name']}</h3>
            <p>{skill['description']}</p>
            <div class="path">{skill['path']}</div>
        </div>
        """
    return html

def generate_workflows_html(workflows):
    """Genera HTML para la sección de workflows."""
    if not workflows:
        return '<div class="empty-state">No hay workflows configurados</div>'
    
    html = ""
    for workflow in workflows:
        html += f"""
        <div class="card">
            <h3>{workflow['name']}</h3>
            <p>{workflow['description']}</p>
            <div class="path">{workflow['path']}</div>
        </div>
        """
    return html

def generate_knowledge_html(knowledge):
    """Genera HTML para la sección de knowledge."""
    if not knowledge:
        return '<div class="empty-state">No hay archivos de conocimiento</div>'
    
    html = ""
    for item in knowledge:
        html += f"""
        <div class="card">
            <h3>{item['title']}</h3>
            <div class="path">{item['path']}</div>
        </div>
        """
    return html

def generate_tools_html(tools):
    """Genera HTML para la sección de tools."""
    if not tools:
        return '<div class="empty-state">No hay tools configurados</div>'
    
    html = ""
    for tool in tools:
        html += f"""
        <div class="card">
            <h3>{tool['name']}.py</h3>
            <p>{tool['description']}</p>
            <div class="path">{tool['path']}</div>
        </div>
        """
    return html

if __name__ == "__main__":
    # Ruta al directorio .agent
    script_dir = Path(__file__).parent
    agent_dir = script_dir
    
    # Archivo de salida
    output_file = agent_dir / "agent-summary.html"
    
    # Generar resumen
    generate_html(agent_dir, output_file)
