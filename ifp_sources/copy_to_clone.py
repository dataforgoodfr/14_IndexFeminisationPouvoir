import os
import shutil

SOURCE = r"d:\Data For Good\IFP Oxfam Projet Integration\14_IndexFeminisationPouvoir"
DEST = r"d:\Data For Good\clone_git"

EXCLUDE_EXT = [".csv"]  # on exclut les CSV lourds
EXCLUDE_DIRS = [
    ".git",
    ".venv",
    "__pycache__",
    "data/administration",
]  # adapte si besoin

for root, dirs, files in os.walk(SOURCE):
    # Exclure les dossiers inutiles
    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

    for file in files:
        src_path = os.path.join(root, file)

        # Exclure les CSV lourds
        if any(file.lower().endswith(ext) for ext in EXCLUDE_EXT):
            continue

        # Calcul du chemin destination
        rel_path = os.path.relpath(src_path, SOURCE)
        dest_path = os.path.join(DEST, rel_path)

        # Créer les dossiers si nécessaires
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)

        print(f"Copie : {src_path} -> {dest_path}")
        shutil.copy2(src_path, dest_path)
