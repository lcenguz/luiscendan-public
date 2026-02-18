import os
import sys
import json
import re
import logging
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime

class LuisCendanAgent:
    def __init__(self):
        # Configuración de carpetas
        self.output_dir = "./agent_storage"
        self.raw_backup_dir = os.path.join(self.output_dir, "raw_backups")
        os.makedirs(self.raw_backup_dir, exist_ok=True)
        
        # Logs
        self.log_file = os.path.join(self.output_dir, "agent_forensics.log")
        logging.basicConfig(
            filename=self.log_file,
            level=logging.INFO,
            format='%(asctime)s - [%(levelname)s] - %(message)s'
        )
        self.log("NÚCLEO FORENSE ACTIVADO. Respaldando entradas originales.")

    def log(self, msg, level="info"):
        print(f"🚀 [Luis Cendan Agent IA]: {msg}")
        if level == "info": logging.info(msg)
        elif level == "repair": logging.warning(f"REPARACIÓN: {msg}")
        elif level == "backup": logging.info(f"BACKUP_OK: {msg}")

    def _hacer_backup(self, contenido, tipo):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nombre_archivo = f"backup_{tipo}_{timestamp}.raw"
        ruta = os.path.join(self.raw_backup_dir, nombre_archivo)
        with open(ruta, "w", encoding="utf-8") as f:
            f.write(contenido)
        self.log(f"Original guardado en {nombre_archivo}", "backup")

    def _reparar_json(self, texto):
        self._hacer_backup(texto, "json")
        # Reparación de comas y espacios
        texto_limpio = re.sub(r',\s*([\]}])', r'\1', texto.strip())
        return texto_limpio

    def _reparar_xml(self, texto):
        self._hacer_backup(texto, "xml")
        tags = re.findall(r'<([a-zA-Z0-9]+)>', texto)
        for tag in reversed(tags):
            if f"</{tag}>" not in texto:
                texto += f"</{tag}>"
        return texto

    def dispatch(self, raw_input):
        raw_input = str(raw_input).strip()
        
        # 1. ¿ES ESTRUCTURA JSON?
        if raw_input.startswith('{') or raw_input.startswith('['):
            try:
                data = json.loads(self._reparar_json(raw_input))
                return f"SUCCESS: JSON_REPARADO"
            except Exception as e:
                self.log(f"Error fatal JSON: {e}", "error")

        # 2. ¿ES ESTRUCTURA XML?
        if raw_input.startswith('<'):
            try:
                root = ET.fromstring(self._reparar_xml(raw_input))
                return f"SUCCESS: XML_CERRADO_Y_VALIDO"
            except Exception as e:
                self.log(f"Error fatal XML: {e}", "error")

        # 3. TEXTO / COMANDO
        self._hacer_backup(raw_input, "text")
        return f"SUCCESS: PROMPT_PROCESADO"

if __name__ == "__main__":
    agent = LuisCendanAgent()
    if len(sys.argv) > 1:
        print(agent.dispatch(sys.argv[1]))
