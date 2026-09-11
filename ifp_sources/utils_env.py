# utils_env.py
import os


def load_env_file(env_path: str):
    """
    Charge un fichier .env (clé=valeur) et initialise os.environ.
    Compatible accents, commentaires, lignes vides.
    """
    if not os.path.exists(env_path):
        raise FileNotFoundError(f"❌ Fichier .env introuvable : {env_path}")

    print(f"📁 Chargement du fichier env : {env_path}")

    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            os.environ[key] = value
            print(f"  → {key} chargé")
