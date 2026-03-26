from pathlib import Path

# 1. On trouve le chemin du dossier où se trouve constants.py
# .parent remonte d'un niveau pour arriver à la racine du projet
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. On définit le dossier de sortie de manière absolue
OUTPUT_DIR = BASE_DIR / "data"

# 3. Sécurité : On s'assure que le dossier existe
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
