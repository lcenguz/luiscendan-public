# 🎯 Plantilla para Crear Nuevos Agentes

Esta carpeta contiene la plantilla base para crear nuevos agentes de IA.

## 📋 Cómo Usar Esta Plantilla

1. **Copia la carpeta completa:**
   ```bash
   cp -r templates/skill-template skills/mi-nuevo-agente
   ```

2. **Renombra según tu agente:**
   - Usa kebab-case: `mongodb-helper`, `git-assistant`, etc.

3. **Edita `SKILL.md`:**
   - Actualiza el frontmatter YAML
   - Personaliza las instrucciones
   - Añade ejemplos relevantes

4. **Añade recursos adicionales** (opcional):
   - `scripts/` - Scripts de ayuda
   - `examples/` - Ejemplos de uso
   - `resources/` - Archivos de referencia

5. **Documenta en el README principal:**
   - Añade una sección describiendo tu agente
   - Incluye ejemplos de uso

## 📝 Estructura del Frontmatter

```yaml
---
name: nombre-del-agente          # Identificador único
version: 1.0.0                   # Semantic versioning
description: |                   # Descripción multilínea
  Descripción clara y concisa
  del propósito del agente
allowed-tools:                   # Herramientas que puede usar
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - RunCommand                   # Solo si necesita ejecutar comandos
---
```

## 🛠️ Herramientas Disponibles

- **Read:** Leer archivos
- **Write:** Crear archivos nuevos
- **Edit:** Modificar archivos existentes
- **Grep:** Buscar en archivos
- **Glob:** Buscar archivos por patrón
- **RunCommand:** Ejecutar comandos (usar con precaución)
- **AskUserQuestion:** Preguntar al usuario

## ✅ Checklist de Creación

- [ ] Frontmatter YAML completo y correcto
- [ ] Descripción clara del propósito
- [ ] Instrucciones paso a paso
- [ ] Al menos 2-3 ejemplos antes/después
- [ ] Proceso de trabajo definido
- [ ] Formato de salida especificado
- [ ] Referencias (si aplica)
- [ ] Documentado en README principal

## 💡 Ideas de Agentes Útiles

### Para el Máster
- **mongodb-helper:** Asistencia con MongoDB y NoSQL
- **big-data-architect:** Diseño de arquitecturas Big Data
- **sql-optimizer:** Optimización de consultas SQL
- **docker-helper:** Asistencia con Docker y contenedores
- **cloud-architect:** Diseño de soluciones cloud (Azure, AWS)

### Para Desarrollo
- **code-reviewer:** Revisión de código y mejores prácticas
- **git-assistant:** Gestión avanzada de Git
- **test-generator:** Generación de tests unitarios
- **api-designer:** Diseño de APIs RESTful
- **security-auditor:** Auditoría de seguridad

### Para Productividad
- **meeting-summarizer:** Resúmenes de reuniones
- **email-drafter:** Redacción de emails profesionales
- **presentation-maker:** Creación de presentaciones
- **documentation-writer:** Documentación técnica

## 🎨 Mejores Prácticas

1. **Sé específico:** Define claramente qué hace y qué no hace el agente
2. **Usa ejemplos:** Muestra antes/después para claridad
3. **Documenta limitaciones:** Sé honesto sobre lo que no puede hacer
4. **Mantén actualizado:** Incrementa la versión con cambios
5. **Prueba antes de usar:** Verifica que funciona como esperas

## 📚 Recursos

- [Documentación de MCP](https://modelcontextprotocol.io/)
- [Guía de Markdown](https://www.markdownguide.org/)
- [Semantic Versioning](https://semver.org/)
