"""
Monitor de Agentes IA - Auto-actualización del Dashboard
Monitorea cambios en la carpeta .agent y actualiza el dashboard automáticamente
"""

import os
import json
import time
from pathlib import Path
from datetime import datetime
import re

# Configuración
AGENT_DIR = Path(__file__).parent
DASHBOARD_FILE = AGENT_DIR / "dashboard.html"
SKILLS_DIR = AGENT_DIR / "skills"

def parse_skill_frontmatter(skill_path):
    """Extrae información del frontmatter YAML de un SKILL.md"""
    skill_file = skill_path / "SKILL.md"
    if not skill_file.exists():
        return None
    
    with open(skill_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraer frontmatter
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL | re.MULTILINE)
    if not match:
        return None
    
    frontmatter = match.group(1)
    
    # Parsear campos
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

def count_files_recursive(directory):
    """Cuenta archivos recursivamente"""
    count = 0
    for item in directory.rglob('*'):
        if item.is_file():
            count += 1
    return count

def generate_file_tree(directory, prefix="", max_depth=3, current_depth=0):
    """Genera árbol de archivos en formato texto"""
    if current_depth >= max_depth:
        return ""
    
    tree = ""
    items = sorted(directory.iterdir(), key=lambda x: (not x.is_dir(), x.name))
    
    for i, item in enumerate(items):
        is_last = i == len(items) - 1
        connector = "└── " if is_last else "├── "
        
        if item.is_dir():
            tree += f'{prefix}{connector}<span class="folder">📁 {item.name}/</span>\n'
            extension = "    " if is_last else "│   "
            tree += generate_file_tree(item, prefix + extension, max_depth, current_depth + 1)
        else:
            icon = "📄"
            if item.suffix == ".md":
                icon = "📝"
            elif item.suffix == ".html":
                icon = "🌐"
            elif item.suffix == ".py":
                icon = "🐍"
            tree += f'{prefix}{connector}{icon} {item.name}\n'
    
    return tree

def get_agent_icon(name):
    """Obtiene icono apropiado para cada agente"""
    icons = {
        'humanizer': '🎨',
        'blade-humanizer': '🎨',
        'academic-writer': '📝',
        'data-analyzer': '📊',
        'mongodb-helper': '🍃',
        'big-data-architect': '🏗️',
        'docker-helper': '🐳',
        'git-assistant': '🔀'
    }
    
    for key, icon in icons.items():
        if key in name.lower():
            return icon
    
    return '🤖'

def update_dashboard():
    """Actualiza el dashboard HTML con información actual"""
    agents = get_all_agents()
    file_count = count_files_recursive(AGENT_DIR)
    agent_count = len(agents)
    
    # Generar HTML de agentes
    agents_html = ""
    for agent in agents:
        icon = get_agent_icon(agent['name'])
        # Limpiar descripción (quitar saltos de línea extras)
        desc = ' '.join(agent['description'].split())
        agents_html += f'''
                    <li class="agent-item">
                        <div class="agent-name">{icon} {agent['name']}</div>
                        <div class="agent-version">v{agent['version']}</div>
                        <div class="agent-desc">{desc}</div>
                    </li>'''
    
    # Generar árbol de archivos
    file_tree = generate_file_tree(AGENT_DIR, max_depth=3)
    
    # Leer template actual
    with open(DASHBOARD_FILE, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Actualizar contadores
    html_content = re.sub(
        r'<div class="stat-value" id="agentCount">\d+</div>',
        f'<div class="stat-value" id="agentCount">{agent_count}</div>',
        html_content
    )
    
    html_content = re.sub(
        r'<div class="stat-value" id="fileCount">\d+</div>',
        f'<div class="stat-value" id="fileCount">{file_count}</div>',
        html_content
    )
    
    # Actualizar badge de agentes activos
    html_content = re.sub(
        r'<span class="badge badge-success">\d+ activos</span>',
        f'<span class="badge badge-success">{agent_count} activos</span>',
        html_content
    )
    
    # Actualizar lista de agentes
    html_content = re.sub(
        r'<ul class="agent-list">.*?</ul>',
        f'<ul class="agent-list">{agents_html}\n                </ul>',
        html_content,
        flags=re.DOTALL
    )
    
    # Actualizar árbol de archivos
    html_content = re.sub(
        r'<div class="file-tree">\n.*?\n                </div>',
        f'<div class="file-tree">\n{file_tree}                </div>',
        html_content,
        flags=re.DOTALL
    )
    
    # Actualizar estadísticas del sistema
    html_content = re.sub(
        r'<div class="stat-value" style="color: var\(--success\);">\d+</div>\s*<div class="stat-label">Agentes Activos</div>',
        f'<div class="stat-value" style="color: var(--success);">{agent_count}</div>\n                        <div class="stat-label">Agentes Activos</div>',
        html_content
    )
    
    # Guardar dashboard actualizado
    with open(DASHBOARD_FILE, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ Dashboard actualizado: {agent_count} agentes, {file_count} archivos")
    print(f"   Última actualización: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def monitor_changes():
    """Monitorea cambios en la carpeta .agent"""
    print("🔍 Monitoreando cambios en .agent/")
    print("   Presiona Ctrl+C para detener\n")
    
    last_mtime = {}
    
    try:
        while True:
            changed = False
            
            # Verificar cambios en archivos
            for file_path in AGENT_DIR.rglob('*'):
                if file_path.is_file() and file_path.name != 'monitor.py':
                    try:
                        mtime = file_path.stat().st_mtime
                        
                        if str(file_path) not in last_mtime:
                            last_mtime[str(file_path)] = mtime
                        elif last_mtime[str(file_path)] != mtime:
                            print(f"📝 Cambio detectado: {file_path.name}")
                            last_mtime[str(file_path)] = mtime
                            changed = True
                    except:
                        pass
            
            if changed:
                update_dashboard()
                print()
            
            time.sleep(2)  # Verificar cada 2 segundos
            
    except KeyboardInterrupt:
        print("\n\n👋 Monitor detenido")

if __name__ == "__main__":
    print("=" * 60)
    print("🤖 MONITOR DE AGENTES IA - Auto-actualización Dashboard")
    print("=" * 60)
    print()
    
    # Actualización inicial
    update_dashboard()
    print()
    
    # Iniciar monitoreo
    monitor_changes()
