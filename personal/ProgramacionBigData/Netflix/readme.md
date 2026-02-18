# Análisis de datos de Netflix – Guía de inicio

## 1. Requisitos previos

Antes de empezar, asegúrate de tener instalado:

* Python **3.9 o superior**
* `pip`
* Un editor de código (VS Code recomendado)

Para comprobar tu versión de Python:

```bash
python --version
```

---

## 2. Crear un entorno virtual

Trabajaremos dentro de un **entorno virtual** para aislar las dependencias del proyecto.

### 2.1 Crear el entorno virtual

Desde la carpeta del proyecto:

```bash
python -m venv venv
```

Esto creará una carpeta llamada `venv/`.

---

### 2.2 Activar el entorno virtual

#### En Windows

```bash
venv\Scripts\activate
```

#### En macOS / Linux

```bash
source venv/bin/activate
```

Cuando el entorno esté activo, verás algo parecido a:

```text
(venv)
```

en la terminal.

---

## 3. Instalar las dependencias

Con el entorno virtual activado, instala las librerías necesarias:

```bash
pip install pandas numpy seaborn matplotlib
```

Opcionalmente, puedes guardar las dependencias en un archivo:

```bash
pip freeze > requirements.txt
```

---

## 4. Estructura del proyecto

El proyecto está dividido en varios ficheros para trabajar de forma modular:

```
netflix_analysis/
│
├── main.py
├── data_loader.py
├── data_cleaning.py
├── analysis.py
├── visualization.py
├── netflix_analyzer.py   # opcional (bonus)
├── netflix_titles.csv
└── README.md
```

Cada fichero tiene una responsabilidad concreta dentro del flujo del proyecto.

---

## 5. Desarrollo del ejercicio (orden recomendado)

Se recomienda **seguir este orden**:

### Paso 1: Carga y exploración

* Implementar las funciones en `data_loader.py`
* Explorar el dataset para entender su estructura
* Detectar posibles problemas de calidad de datos

### Paso 2: Limpieza y validación de datos

* Implementar las funciones en `data_cleaning.py`
* No modificar el DataFrame original
* Comprobar que los tipos y valores son coherentes
* Corregir o tratar datos inconsistentes si es necesario

### Paso 3: Análisis

* Implementar las funciones en `analysis.py`
* Comprobar los resultados usando salidas por pantalla
* Asegurarse de que los resultados tienen sentido

### Paso 4: Visualización

* Implementar los gráficos en `visualization.py`
* Usar Seaborn y Matplotlib correctamente
* Generar gráficos claros y bien etiquetados

### Paso 5 (opcional): Clases

* Implementar la clase `NetflixAnalyzer`
* Centralizar el flujo de análisis en un único objeto

---

## 6. Ejecución del programa

Una vez implementadas las funciones, ejecutar desde la raíz del proyecto:

```bash
python main.py
```

---

## 7. Buenas prácticas

* Implementar **una función cada vez**
* Probar el código de forma incremental
* Usar nombres de variables claros y descriptivos
* Añadir comentarios cuando sea necesario
* Mantener cada fichero enfocado en una única responsabilidad
* No asumir que los datos son correctos sin validarlos

---

## 8. Objetivo final

Al terminar el ejercicio deberías ser capaz de:

* Trabajar con un dataset real
* Detectar y tratar problemas de calidad de datos
* Crear funciones reutilizables
* Analizar información de forma estructurada
* Visualizar resultados de manera clara
* Organizar un proyecto en Python de forma profesional

Este ejercicio está diseñado para simular un entorno real de trabajo con datos, donde la validación y la interpretación correcta de la información son tan importantes como la implementación técnica.

