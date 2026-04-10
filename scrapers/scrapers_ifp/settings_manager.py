import os
from dotenv import load_dotenv
from scrapers.scrapers_ifp.constants import OUTPUT_DIR, S3_PREFIX


# On crée une erreur sur-mesure pour que ce soit très clair
class S3ConfigurationError(Exception):
    """
    Exception levée si des variables d'environnement S3 requises sont manquantes.
    """

    pass


def validate_s3_credentials():
    """
    Valide la présence des variables d'environnement S3 nécessaires.

    Cette fonction vérifie si toutes les variables d'environnement de configuration S3
    requises sont présentes. Si l'une d'entre elles manque, elle lève une erreur
    S3ConfigurationError pour indiquer quelles variables font défaut.

    Raises:
        S3ConfigurationError: Levée lorsqu'une ou plusieurs variables d'environnement
        S3 requises sont manquantes.
    """
    load_dotenv()
    required_keys = [
        "S3_ACCESS_KEY",
        "S3_SECRET_ACCESS_KEY",
        "S3_REGION",
        "S3_ENDPOINT_URL",
        "S3_BUCKET_NAME",
    ]
    missing = [key for key in required_keys if not os.getenv(key)]

    if missing:
        raise S3ConfigurationError(f"Variables S3 manquantes : {', '.join(missing)}")


def get_feeds_settings(storage_type):
    """
    Génère la configuration FEEDS pour Scrapy en fonction du type de stockage choisi.
    Configure également les variables d'environnement AWS pour l'export S3.

    Args:
        storage_type (str): Le type de stockage ('local', 's3', ou 'both').

    Returns:
        dict: Un dictionnaire contenant la clé 'FEEDS' avec sa configuration.
    """
    feeds = {}
    if storage_type in ["local", "both"]:
        feeds[f"file://{OUTPUT_DIR}/%(name)s_%(time)s.csv"] = {"format": "csv"}

    if storage_type in ["s3", "both"]:
        bucket = os.getenv("S3_BUCKET_NAME")
        s3_uri = f"s3://{bucket}/{S3_PREFIX}%(name)s_%(time)s.csv"
        feeds[s3_uri] = {"format": "csv"}

        # Configuration des variables d'environnement AWS pour l'export S3 de scrapy.
        # On pourrait aussi utiliser les settings de scrapy, ce qui serait préférable en cas (très improbable...)
        # d'export vers plusieurs buckets.
        os.environ["AWS_ACCESS_KEY_ID"] = os.getenv("S3_ACCESS_KEY", "")
        os.environ["AWS_SECRET_ACCESS_KEY"] = os.getenv("S3_SECRET_ACCESS_KEY", "")
        os.environ["AWS_ENDPOINT_URL"] = os.getenv("S3_ENDPOINT_URL", "")
        os.environ["AWS_REGION_NAME"] = os.getenv("S3_REGION", "")

    return {"FEEDS": feeds}
