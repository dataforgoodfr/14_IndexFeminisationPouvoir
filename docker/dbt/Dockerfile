# On utilise Python 3.13 pour éviter les packages non encore compatibles avec Python 3.14
FROM python:3.13-slim

# On installe uv directement dans l'image système
RUN pip install uv

WORKDIR /app

# On copie les fichiers de configuration de uv
COPY pyproject.toml uv.lock ./

# Installer les dépendances (sans le code source)
# --frozen : échoue si uv.lock n'est pas à jour (sécurité)
RUN uv sync --no-cache --no-install-project --frozen

COPY dbt_ifp/ dbt_ifp/

# Installation du projet
RUN uv sync

# Commande par défaut si nécessaire
#CMD ["python", "main.py"]