import os
import logging

# ---------------------------------------------------------
# CONFIG LOGGING
# ---------------------------------------------------------
logger = logging.getLogger(__name__)


def build_conn_str_from_env() -> str:
    """
    Construit la chaîne de connexion PostgreSQL à partir des variables d'environnement.
    """
    try:
        user = os.environ["POSTGRES_USER"]
        pwd = os.environ["POSTGRES_PASSWORD"]
        host = os.environ["POSTGRES_HOST"]
        port = os.environ.get("POSTGRES_PORT", "5432")
        db = os.environ["POSTGRES_DB_NAME"]

        conn_str = f"postgresql://{user}:{pwd}@{host}:{port}/{db}"
        logging.info(
            "Chaîne de connexion PostgreSQL construite depuis l'environnement."
        )
        return conn_str

    except KeyError as e:
        logging.error(f"Variable d'environnement manquante : {e}")
        raise

    except Exception as e:
        logging.error(
            f"Erreur inattendue lors de la construction de la chaîne de connexion : {e}"
        )
        raise
