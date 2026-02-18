# 📁 Workflows - Flujos de Trabajo Automatizados

Esta carpeta contendrá workflows automatizados para tareas comunes.

## 🎯 ¿Qué son los Workflows?

Los workflows son secuencias de pasos bien definidos para realizar tareas específicas. Se definen en archivos `.md` con formato YAML frontmatter + markdown.

## 📋 Formato

```markdown
---
description: Descripción corta del workflow
---

# Nombre del Workflow

Descripción detallada del propósito.

## Pasos

1. Primer paso con instrucciones claras
2. Segundo paso
// turbo
3. Tercer paso (se auto-ejecutará si es comando)
```

## 🚀 Anotaciones Especiales

- `// turbo` - Auto-ejecuta el siguiente paso si es un comando
- `// turbo-all` - Auto-ejecuta TODOS los comandos del workflow

## 💡 Ideas de Workflows

### Académicos
- `/entregar-tarea` - Preparar y comprimir entrega
- `/revisar-documento` - Checklist de revisión académica
- `/generar-bibliografia` - Formatear referencias

### Desarrollo
- `/deploy` - Desplegar aplicación
- `/test-all` - Ejecutar todos los tests
- `/git-sync` - Sincronizar con remoto

### Productividad
- `/backup` - Hacer backup del proyecto
- `/clean-project` - Limpiar archivos temporales
- `/update-deps` - Actualizar dependencias

## 📝 Ejemplo: Workflow de Entrega

```markdown
---
description: Preparar entrega de tarea del máster
---

# Preparar Entrega de Tarea

Workflow para preparar y comprimir una entrega académica.

## Pasos

1. Revisar que todos los archivos necesarios estén presentes
2. Ejecutar el humanizer en documentos markdown
3. Convertir a PDF si es necesario
// turbo
4. Crear carpeta de entrega: `mkdir -p entregas/EntregaX_JoseLuisCendanGuzman`
// turbo
5. Copiar archivos: `cp documento.pdf entregas/EntregaX_JoseLuisCendanGuzman/`
// turbo
6. Comprimir: `Compress-Archive -Path entregas/EntregaX_JoseLuisCendanGuzman -DestinationPath EntregaX_JoseLuisCendanGuzman.zip`
7. Verificar el contenido del ZIP
```

## 🎨 Mejores Prácticas

1. **Nombres descriptivos:** Usa nombres claros para los workflows
2. **Pasos específicos:** Cada paso debe ser accionable
3. **Comandos exactos:** Incluye comandos completos, no parciales
4. **Documentación:** Explica el propósito de cada paso
5. **Turbo con cuidado:** Solo auto-ejecuta comandos seguros

---

**Próximamente:** Workflows específicos para el máster y desarrollo
