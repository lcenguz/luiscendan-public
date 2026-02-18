# ==============================================================
# Práctica Avanzada: Gestión de Estudiantes con Clases y CSV
# ==============================================================
# Implementa un sistema de gestión de estudiantes utilizando
# programación orientada a objetos y persistencia en ficheros CSV.
# ==============================================================
# --------------------------------------------------------------
# Clase Estudiante
# --------------------------------------------------------------
from typing import List
import pandas as pd
import os

#Se crean las clases propias de excepciones que se van a usar
class  InvalidatedNotasError(Exception):
    """Excepción personalizada para notas inválidas."""
    def __init__(self, mensaje):
        self.mensaje = mensaje

class EstudianteNotFound(Exception):
    """Excepción personalizada para estudiantes no encontrados."""
    def __init__(self, mensaje):
        self.mensaje = mensaje
    
class Estudiante:
    """
    Representa a un estudiante con nombre, notas, promedio y estado.
    El identificador (id) es gestionado externamente por el GestorEstudiantes.
    """
    def __init__(self, nombre:str, notas:List[float]):
        """
        TODO: Inicializar el estudiante con su nombre y lista de notas (float).
        El id será asignado externamente por el gestor de estudiantes.
        Calcular automáticamente su promedio y estado.
        """
        #Validamos el nombre
        if not nombre or not isinstance(nombre,str) or nombre.strip() =="":
            raise ValueError("El nombre no puede ser una cadena vacía o nula")
        #Si tenemos notas validas
        if (self._validar_notas(notas)):
            self.__nombre = nombre
            self.__notas = notas
            self.__promedio = self.calcular_promedio()
            self.__estado = self.determinar_estado()
        else:
            raise InvalidatedNotasError("Las notas no son validas")


    @staticmethod
    def _validar_notas(notas:List[float]):
        """
        Validar las notas que sean validas. Para ello se tiene que cumplir:
        - Que la lista no sea nula
        - Que la lista no sea vacía
        - Que todos los elementos de la lista sean de tipo float
        - Que todos los elementos de la lista estén entre 0 y 10
        """

        #Validamos las notas (se entiende que el estudiante tiene que tener las notas asignadas para poder insertarlo en la plataforma.)
        if notas is None or not isinstance(notas,list):
            raise InvalidatedNotasError("Deben tener notas asignadas")
        
        #Validamos que la lista no sea vacía
        if len(notas) == 0:
            raise InvalidatedNotasError("Deben tener notas asignadas")
        
        #Validamos que las notas sean de tipo float
        for nota in notas:
            if not isinstance(nota, float):
                raise InvalidatedNotasError(f"Error al crear el estudiante: La nota {nota} es de tipo {type(nota)} y debe ser de tipo float")
            if nota < 0 or nota > 10:
                raise InvalidatedNotasError(f"Error al crear el estudiante: La nota {nota} debe estar entre 0 y 10")
        
        return True

    def calcular_promedio(self):
        """
        TODO: Calcular y actualizar el promedio del estudiante en base a sus notas.
        Si no tiene notas, el promedio será 0.
        """
        try:
            #Validamos que el estudiante tenga notas y que la lista sea instancia de list
            if not isinstance(self.__notas, list) or len(self.__notas) == 0:
                raise InvalidatedNotasError("Deben tener notas asignadas")
            return sum(self.__notas) / len(self.__notas)
        except ZeroDivisionError:
            return 0.0
    
    def determinar_estado(self):
        """
        TODO: Determinar si el estudiante está 'Aprobado' o 'Suspenso' según su promedio.
        Aprobado si el promedio >= 5.0.
        """
        return ("Suspenso", "Aprobado")[self.__promedio >= 5]

    def actualizar_notas(self, nuevas_notas):
        """
        TODO: Reemplazar las notas actuales del estudiante por las nuevas.
        Recalcular promedio y estado después de la actualización.
        """
    
        self._validar_notas(nuevas_notas)
        self.__notas = nuevas_notas
        self.__promedio = self.calcular_promedio()
        self.__estado = self.determinar_estado()

    def get_notas(self):
        """
        Getter para obtener las notas del estudiante.
        """
        return self.__notas
    
    def set_notas(self, nuevas_notas):
        """
        Setter para actualizar las notas del estudiante.
        Valida las notas antes de asignarlas.
        """
        self._validar_notas(nuevas_notas)
        self.__notas = nuevas_notas
    
    def to_dict(self):
        """
        Devuelve los datos del estudiante como un diccionario con las claves:
        'nombre', 'promedio' y 'estado'.

        Nota:
            El 'id' se gestiona externamente desde la clase GestorEstudiantes
            y se añadirá al momento de guardar o mostrar la información en CSV.
            Las notas se guardan por separado en 'notas.csv'.
        """
        return {
            "nombre": self.__nombre,
            "notas": self.__notas,
            "promedio": round(self.__promedio,2),
            "estado": self.__estado
        }
    def __str__(self):
        """
        TODO: Retornar una cadena con formato legible:
        "Nombre: <nombre> | Promedio: <promedio> | Estado: <estado>"
        """
        return f"Nombre: {self.__nombre} | Promedio: {self.__promedio:.2f} | Estado: {self.__estado}"
        
    @staticmethod
    def filtrar_notas_por_id(id_estudiante, lista_filas_notas):
        """
        TODO: A partir de una lista de filas del CSV de notas (cada una con id_estudiante y
        nota),devolver una lista de notas (floats) correspondientes al id_estudiante recibido.
        Si no existen notas asociadas, devolver una lista vacía.
        """
        # Validar id_estudiante
        if id_estudiante is None or not isinstance(id_estudiante, int):
            raise ValueError(f"El id_estudiante introducido {id_estudiante} es de tipo {type(id_estudiante)} y debe ser un entero")
        if id_estudiante < 0:
            raise ValueError(f"El id_estudiante introducido {id_estudiante} debe ser mayor o igual a 0")
        
        # Validar lista_filas_notas
        if lista_filas_notas is None or not isinstance(lista_filas_notas, list) or len(lista_filas_notas) == 0:
            raise ValueError("lista_filas_notas debe ser una lista válida")


        notas = []
        ids_encontrados = set()
        
        #Recorremos la lisa de filas para ver que tenemos los parametros correctos y los vamos añadiende a la lista de notas y a la lista de ids encontrados    
        for fila in lista_filas_notas:
            if not isinstance(fila, dict) or 'id_estudiante' not in fila or 'nota' not in fila:
                raise ValueError(f"Cada fila debe ser un diccionario con 'id_estudiante' y 'nota'")
            
            id_fila = int(fila['id_estudiante'])
            ids_encontrados.add(id_fila)
            
            if id_fila == id_estudiante:
                notas.append(float(fila['nota']))

        return notas
# --------------------------------------------------------------
# Clase GestorEstudiantes
# --------------------------------------------------------------
class GestorEstudiantes:
    """
    Clase que gestiona el listado de estudiantes y su persistencia
    utilizando dos ficheros CSV: 'estudiantes.csv' y 'notas.csv'.
    """
    def __init__(self, archivo_estudiantes:str, archivo_notas:str):
        """
        TODO: Inicializar el gestor con los nombres de los archivos CSV.
        Cargar automáticamente los datos desde ambos archivos (si existen),
        uniendo los estudiantes con sus notas a partir del id.
        """
        self.archivo_estudiantes = archivo_estudiantes
        self.archivo_notas = archivo_notas
        self.estudiantes : List[Estudiante] = []
        self.cargar_desde_csv() 

    def registrar_estudiante(self, nombre:str, notas:List[float]):
        """
        TODO: Crear un nuevo estudiante (solo con nombre y notas) y asignarle un id único generado
        dentro del gestor (por ejemplo, el máximo id existente + 1).
        Calcular su promedio y estado, añadirlo a la lista y guardar los datos actualizados en los CSV
        correspondientes ('estudiantes.csv' y 'notas.csv').
        
        Nota: El ID se asigna automáticamente en guardar_en_csv() según la posición en la lista.
        """
        try:
            #if self.buscar_estudiante(nombre):
            #    raise ValueError(f"El estudiante {nombre} ya existe")
            
            nuevo_estudiante = Estudiante(nombre, notas)
            self.estudiantes.append(nuevo_estudiante)
            # El ID se asigna automáticamente al guardar (índice en la lista + 1)
            self.guardar_en_csv()
        except (ValueError,InvalidatedNotasError) as exception:
            raise ValueError(f" Error al registrar el estudiante: {exception}")
        except Exception as exception:
            raise Exception(f" Error del sistema al registrar el estudiante: {exception}")

    def eliminar_estudiante(self, nombre):
        """
        TODO: Eliminar un estudiante de la lista (sin distinguir mayúsculas/minúsculas) y eliminar
        también sus notas asociadas del archivo de notas.
        Guardar los cambios en ambos CSV.
        """
        try:
            estudiante = self.buscar_estudiante(nombre)
            if estudiante is None:
                raise EstudianteNotFound(f"El estudiante {nombre} no existe")
            self.estudiantes.remove(estudiante)
            self.guardar_en_csv()
            print(f"Estudiante '{nombre}' eliminado correctamente.")
        except EstudianteNotFound as exception:
            raise EstudianteNotFound(f"No se pudo eliminar el estudiante: {exception}")
        except Exception as exception:
            raise Exception(f" Error del sistema al borrar el estudiante: {exception}")
        
    def promedio_general(self):
        """
        TODO: Calcular el promedio general del grupo en base al promedio de todos los estudiantes.
        Si no hay estudiantes, devolver 0.
        """
        try:
            if not self.estudiantes:
                return 0.0
            #Convertimos la lista de estudiantes en un DataFrame  para poder calcular el promedio general
            df = pd.DataFrame([promedio.to_dict() for promedio in self.estudiantes])
            return round(df['promedio'].mean(),2)
        except Exception as exception:
             raise Exception(f" Error del sistema al calcular el promedio general: {exception}")
        
    def buscar_estudiante(self, nombre):
        """
        TODO: Buscar y retornar un objeto Estudiante cuyo nombre coincida (sin distinguir mayúsculas).
        Si no se encuentra, devolver None.
        """
        try:
            estudiante_lower = nombre.lower().strip()
            for estudiante in self.estudiantes:
                if estudiante_lower == estudiante.to_dict()['nombre'].lower().strip():
                    return estudiante
            return None
        except Exception as exception:
             raise Exception(f" Error inesperado al buscar el estudiante: {exception}")
        
        
    def actualizar_notas(self, nombre, nuevas_notas):
        """
        TODO: Buscar el estudiante indicado por nombre, actualizar sus notas, recalcular promedio y
        estado, y guardar los cambios en ambos CSV.
        Si el estudiante no existe, mostrar un mensaje de error.
        """
        try:
            estudiante = self.buscar_estudiante(nombre)
            if estudiante is None:
                raise EstudianteNotFound(f"El estudiante {nombre} no existe")
            estudiante.actualizar_notas(nuevas_notas)
            self.guardar_en_csv()
            print(f"Notas de '{nombre}' actualizadas correctamente.")
        except EstudianteNotFound as exception:
             raise EstudianteNotFound(f"No se pudo actualizar el estudiante: {exception}")
        except Exception as exception:
             raise Exception(f"Error del sistema al actualizar el estudiante: {exception}")
    
    def mostrar_estudiantes(self):
        """
        TODO: Mostrar por consola todos los estudiantes en formato:
        "ID: <id> | Nombre: <nombre> | Promedio: <promedio> | Estado: <estado>"
        """
        try:
            if not self.estudiantes:
                raise ValueError("No hay estudiantes registrados")
            for idx, estudiante in enumerate(self.estudiantes, start=1):
                # Concatenamos el ID con el __str__() del estudiante
                print(f"ID: {idx} | {estudiante.__str__()}")
        except ValueError as exception:
            raise ValueError(f"Error al mostrar los estudiantes: {exception}")
        except Exception as exception:
            raise Exception(f"Error del sistema al mostrar los estudiantes: {exception}")
    def mostrar_por_estado(self, filtro_estado):
        """
        TODO: Mostrar todos los estudiantes cuyo estado coincida con el valor de filtro_estado
        ('Aprobado' o 'Suspenso').
        """
        try:
            if not self.estudiantes:
                print("No hay estudiantes registrados")
                return
            
            # Filtramos estudiantes por estado y guardamos con su índice
            estudiantes_filtrados = [
                (idx, estudiante) 
                for idx, estudiante in enumerate(self.estudiantes, start=1)
                if estudiante.to_dict()['estado'] == filtro_estado
            ]

            if not estudiantes_filtrados:
                raise ValueError(f"No hay estudiantes con estado '{filtro_estado}'")
            
            # Mostramos cada estudiante concatenando el ID con su __str__()
            for idx, estudiante in estudiantes_filtrados:
                print(f"ID: {idx} | {estudiante.__str__()}")
        except ValueError as exception:
            raise ValueError(f"Error al mostrar los estudiantes por estado: {exception}")
        except Exception as exception:
            raise Exception(f"Error del sistema al mostrar los estudiantes por estado: {exception}")

    def contar_por_estado(self):
        """
        TODO: Devolver un diccionario con el conteo de estudiantes por estado.
        Ejemplo: {'Aprobado': 12, 'Suspenso': 9}
        """        
        try:
            if not self.estudiantes:
                return {'Aprobado':0, 'Suspenso':0}

            df = pd.DataFrame([estudiante.to_dict() for estudiante in self.estudiantes])
            return {'Aprobado': len(df[df['estado'] == 'Aprobado']), 'Suspenso': len(df[df['estado'] == 'Suspenso'])}
        except Exception as exception:
            raise Exception(f"Error del sistema al contar los estudiantes por estado: {exception}")
    def guardar_en_csv(self):
        """
        TODO: Guardar los datos actualizados de los estudiantes en 'estudiantes.csv'
        y las notas en 'notas.csv'.
        Cada archivo debe seguir estas estructuras:
        - 'estudiantes.csv': id, nombre, promedio, estado
        - 'notas.csv': id_estudiante, nota
        # Nota: los objetos Estudiante no almacenan el id internamente;
        # el GestorEstudiantes asigna y gestiona los ids al guardar o cargar datos.
        """
        try:
            df_estudiante = []
            df_notas = []
            
            for i, estudiante in enumerate(self.estudiantes, start=1):
                estudiante_dict = estudiante.to_dict()
                
                df_estudiante.append({
                    'id': i,
                    'nombre': estudiante_dict['nombre'],
                    'promedio': estudiante_dict['promedio'],
                    'estado': estudiante_dict['estado']
                })
                
                # Usamos el getter para obtener las notas
                for nota in estudiante.get_notas():
                    df_notas.append({'id_estudiante': i, 'nota': nota})

            df_estudiante = pd.DataFrame(df_estudiante)
            df_notas = pd.DataFrame(df_notas)

            df_estudiante.to_csv(self.archivo_estudiantes, index=False)
            df_notas.to_csv(self.archivo_notas, index=False)
            
        except Exception as e:
            raise Exception(f"Error al guardar en CSV: {e}")
    def cargar_desde_csv(self):
        """
        TODO: Leer los datos desde ambos archivos CSV ('estudiantes.csv' y 'notas.csv'),
        reconstruyendo los objetos Estudiante y asociando sus notas por id_estudiante.
        # Nota: los objetos Estudiante no almacenan el id internamente;
        # el GestorEstudiantes asigna y gestiona los ids al guardar o cargar datos.
        """

        try:
            if not os.path.exists(self.archivo_estudiantes) or not os.path.exists(self.archivo_notas):
                # Si los archivos no existen, iniciar con lista vacía
                print(f"Archivos CSV no encontrados. Se iniciará con lista vacía.")
                return
            
            # Cargamos los datos de los archivos CSV
            df_estudiante=pd.read_csv(self.archivo_estudiantes)
            df_notas=pd.read_csv(self.archivo_notas)

            # Reconstruir objetos Estudiante
            for _, row in df_estudiante.iterrows():
                id_estudiante = row['id']
                nombre = row['nombre']
                
                # Filtrar notas del estudiante usando pandas
                notas_estudiante = [float(nota) for nota in df_notas[df_notas['id_estudiante'] == id_estudiante]['nota'].tolist()]
                
                # Crear objeto Estudiante
                estudiante = Estudiante(nombre, notas_estudiante)
                self.estudiantes.append(estudiante)
        except Exception as e:
            raise Exception(f"Error al cargar desde CSV: {e}")
# --------------------------------------------------------------
# Ejemplo de uso (para pruebas)
# --------------------------------------------------------------
if __name__ == "__main__":
    gestor = GestorEstudiantes(archivo_estudiantes="estudiantes.csv", archivo_notas="notas.csv")
    # ----------------------------------------------------------
    # Registrar estudiantes
    # ----------------------------------------------------------
    gestor.registrar_estudiante("Juan", [7.5, 6.0, 5.5])
    gestor.registrar_estudiante("Ana", [4.0, 5.0, 3.0])
    gestor.registrar_estudiante("Luis", [8.0, 9.0, 10.0])
    # ----------------------------------------------------------
    # Mostrar todos los estudiantes
    # ----------------------------------------------------------
    print("\n=== Todos los estudiantes ===")
    gestor.mostrar_estudiantes()
    # Salida esperada (aproximada):
    # ID: <id> | Nombre: Juan | Promedio: 6.33 | Estado: Aprobado
    # ID: <id> | Nombre: Ana | Promedio: 4.00 | Estado: Suspenso
    # ID: <id> | Nombre: Luis | Promedio: 9.00 | Estado: Aprobado
    # ----------------------------------------------------------
    # Buscar estudiante
    # ----------------------------------------------------------
    print("\n=== Buscar estudiante 'luis' ===")
    est = gestor.buscar_estudiante("luis")
    if est:
        print(est.to_dict())
    # Salida esperada:
    # {'nombre': 'Luis', 'notas': [8.0, 9.0, 10.0], 'promedio': 9.0, 'estado': 'Aprobado'}
    # ----------------------------------------------------------
    # Mostrar aprobados
    # ----------------------------------------------------------
    print("\n=== Estudiantes Aprobados ===")
    gestor.mostrar_por_estado("Aprobado")
    # Salida esperada:
    # ID: <id> | Nombre: Juan | Promedio: 6.33 | Estado: Aprobado
    # ID: <id> | Nombre: Luis | Promedio: 9.00 | Estado: Aprobado
    # ----------------------------------------------------------
    # Mostrar suspensos
    # ----------------------------------------------------------
    print("\n=== Estudiantes Suspensos ===")
    gestor.mostrar_por_estado("Suspenso")
    # Salida esperada:
    # ID: <id> | Nombre: Ana | Promedio: 4.00 | Estado: Suspenso
    # ----------------------------------------------------------
    # Actualizar notas
    # ----------------------------------------------------------
    print("\n=== Actualizar notas de Ana ===")
    gestor.actualizar_notas("Ana", [7.0, 8.0, 6.5, 7.0])
    # Salida esperada:
    # Notas de Ana actualizadas correctamente.
    # Verificar actualización
    print(gestor.buscar_estudiante("Ana").to_dict())
    # Salida esperada:
    # {'nombre': 'Ana', 'notas': [7.0, 8.0, 6.5, 7.0], 'promedio': 7.12, 'estado': 'Aprobado'}
    # ----------------------------------------------------------
    # Promedio general y conteo
    # ----------------------------------------------------------
    print("\n=== Promedio general del grupo ===")
    print(gestor.promedio_general())
    # Ejemplo de salida: 7.48
    print("\n=== Conteo por estado ===")
    print(gestor.contar_por_estado())
    # Ejemplo de salida: {'Aprobado': 3, 'Suspenso': 0}
    # ----------------------------------------------------------
    # Eliminar estudiante
    # ----------------------------------------------------------
    print("\n=== Eliminar estudiante 'Juan' ===")
    gestor.eliminar_estudiante("Juan")
    # Salida esperada:
    # Estudiante 'Juan' eliminado correctamente.
    print("\n=== Lista final de estudiantes ===")
    gestor.mostrar_estudiantes()
    # Salida esperada (final):
    # ID: <id> | Nombre: Ana | Promedio: 7.12 | Estado: Aprobado
    # ID: <id> | Nombre: Luis | Promedio: 9.00 | Estado: Aprobado
