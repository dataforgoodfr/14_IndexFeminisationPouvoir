"""
Module utilitaire pour interactions S3 :
- Lecture CSV/Parquet → pandas DataFrame
- Sauvegarde pandas DataFrame → S3
- Logs structurés
- Gestion d'erreurs robuste
Compatible Docker, WSL2, GitHub Actions, dbt orchestrator.
"""

from __future__ import annotations

import logging
from typing import Optional

import boto3
from botocore.exceptions import ClientError
from pathlib import Path
from io import BytesIO, StringIO
import os
import pandas as pd


# ---------------------------------------------------------------------------
# LOGGING STRUCTURÉ
# ---------------------------------------------------------------------------

logger = logging.getLogger("s3_utils")
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
handler.setFormatter(formatter)
logger.addHandler(handler)


# ---------------------------------------------------------------------------
# CLIENT S3
# ---------------------------------------------------------------------------
import os

def get_s3_env():
    """
    Récupère et valide les variables d'environnement S3.
    Compatible S3 custom (MinIO, Scaleway, Ceph, OVH…)
    """

    required_vars = [
        "S3_ENDPOINT_URL",
        "S3_ACCESS_KEY",
        "S3_SECRET_ACCESS_KEY",
        "S3_REGION",
    ]

    missing = [v for v in required_vars if v not in os.environ]
    if missing:
        raise EnvironmentError(f"Variables S3 manquantes : {missing}")

    return {
        "endpoint_url": os.environ["S3_ENDPOINT_URL"],
        "access_key": os.environ["S3_ACCESS_KEY"],
        "secret_key": os.environ["S3_SECRET_ACCESS_KEY"],
        "region": os.environ["S3_REGION"],
        # Optionnel : tu peux définir un bucket par défaut "bucket": os.getenv("S3_BUCKET_NAME")
        "bucket": os.environ("S3_BUCKET_NAME"),
    }

def _get_s3_client():
    """
    Retourne un client S3 boto3.
    """
    cfg = get_s3_env()

    return boto3.client(
        "s3",
        endpoint_url=cfg["endpoint_url"],
        aws_access_key_id=cfg["access_key"],
        aws_secret_access_key=cfg["secret_key"],
        region_name=cfg["region"],
    )

def get_s3_bucket() -> str:
    bucket = os.getenv("S3_BUCKET_NAME")
    if not bucket:
        raise EnvironmentError("Variable S3_BUCKET_NAME manquante.")
    return bucket

# ---------------------------------------------------------------------------
# COPIE un fichier S3 vers  S3
# ---------------------------------------------------------------------------

def copy_s3_file(
    source_bucket: str,
    source_key: str,
    dest_bucket: str,
    dest_key: str
) -> None:
    """
    Copie un fichier dans S3 sans le télécharger localement.

    Parameters
    ----------
    source_bucket : str
        Bucket source.
    source_key : str
        Chemin du fichier source dans S3.
    dest_bucket : str
        Bucket destination.
    dest_key : str
        Chemin du fichier destination dans S3.

    Raises
    ------
    ClientError
        Si la copie échoue.
    """

    logger.info(
        f"Copie S3 → "
        f"{source_bucket}/{source_key} → {dest_bucket}/{dest_key}"
    )

    s3 = _get_s3_client()

    try:
        s3.copy_object(
            Bucket=dest_bucket,
            Key=dest_key,
            CopySource={
                "Bucket": source_bucket,
                "Key": source_key
            }
        )
        logger.info("✔️ Copie S3 OK")

    except ClientError as e:
        logger.error(f"❌ Erreur copie S3 : {e}")
        raise

# ---------------------------------------------------------------------------
# UPLOAD d'un fichier local dans S3
# ---------------------------------------------------------------------------

def upload_local_file_to_s3(
    local_path: str,
    bucket: str,
    key: str
) -> None:
    """
    Upload d'un fichier local vers S3.

    Parameters
    ----------
    local_path : str
        Chemin local du fichier (ex: 'data/output/result.csv').
    bucket : str
        Nom du bucket S3.
    key : str
        Chemin du fichier dans S3 (ex: 'output/2026/result.csv').

    Raises
    ------
    FileNotFoundError
        Si le fichier local n'existe pas.
    ClientError
        Si l'upload S3 échoue.
    """

    logger.info(
        f"Upload local → S3 : {local_path} → {bucket}/{key}"
    )

    # Vérification fichier local
    if not os.path.exists(local_path):
        raise FileNotFoundError(f"Fichier local introuvable : {local_path}")

    s3 = _get_s3_client()

    try:
        with open(local_path, "rb") as f:
            s3.upload_fileobj(f, bucket, key)

        logger.info("✔️ Upload S3 OK")

    except ClientError as e:
        logger.error(f"❌ Erreur upload S3 : {e}")
        raise


# ---------------------------------------------------------------------------
# UPLOAD d'un répertoire local dans S3
# ---------------------------------------------------------------------------
def copy_local_dir_to_s3(local_dir: str, s3_prefix: str) -> None:
    bucket = get_s3_bucket()
    s3 = _get_s3_client()

    logger.info(f"Copie LOCAL → S3 : {local_dir} → s3://{bucket}/{s3_prefix}")

    local_path = Path(local_dir)
    if not local_path.exists():
        raise FileNotFoundError(f"Répertoire local introuvable : {local_dir}")

    for file_path in local_path.rglob("*"):
        if file_path.is_file():
            relative = file_path.relative_to(local_path)
            s3_key = f"{s3_prefix}/{relative}".replace("\\", "/")

            with open(file_path, "rb") as f:
                s3.upload_fileobj(f, bucket, s3_key)

    logger.info("✔️ Copie LOCAL → S3 terminée")

# ---------------------------------------------------------------------------
# DOWNLOAD d'un répertoire S3 en local
# ---------------------------------------------------------------------------

def copy_s3_dir_to_local(s3_prefix: str, local_dir: str) -> None:
    bucket = get_s3_bucket()
    s3 = _get_s3_client()

    logger.info(f"Copie S3 → LOCAL : s3://{bucket}/{s3_prefix} → {local_dir}")

    local_path = Path(local_dir)
    local_path.mkdir(parents=True, exist_ok=True)

    paginator = s3.get_paginator("list_objects_v2")

    for page in paginator.paginate(Bucket=bucket, Prefix=s3_prefix):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            relative = key[len(s3_prefix):].lstrip("/")
            dest_path = local_path / relative

            dest_path.parent.mkdir(parents=True, exist_ok=True)

            with open(dest_path, "wb") as f:
                s3.download_fileobj(bucket, key, f)

    logger.info("✔️ Copie S3 → LOCAL terminée")


# ---------------------------------------------------------------------------
# LECTURE S3 → DataFrame
# ---------------------------------------------------------------------------

def read_s3_to_df(bucket: str, key: str) -> pd.DataFrame:
    """
    Lit un fichier CSV ou Parquet depuis S3 et renvoie un DataFrame pandas.

    Parameters
    ----------
    bucket : str
        Nom du bucket S3.
    key : str
        Chemin du fichier dans S3 (ex: "data/2026/input.parquet").

    Returns
    -------
    pd.DataFrame
        Le DataFrame chargé.

    Raises
    ------
    ValueError
        Si l'extension n'est pas supportée.
    ClientError
        Si la lecture S3 échoue.
    """

    logger.info(f"Lecture S3 → bucket={bucket}, key={key}")

    s3 = _get_s3_client()

    try:
        obj = s3.get_object(Bucket=bucket, Key=key)
        raw_data = obj["Body"].read()

    except ClientError as e:
        logger.error(f"Erreur S3 lors de la lecture : {e}")
        raise

    # Détection du format
    if key.endswith(".csv"):
        df = pd.read_csv(BytesIO(raw_data))

    elif key.endswith(".parquet"):
        df = pd.read_parquet(BytesIO(raw_data))

    else:
        raise ValueError("Extension non supportée (csv ou parquet uniquement).")

    logger.info(f"Lecture OK : {df.shape[0]} lignes, {df.shape[1]} colonnes")
    return df


# ---------------------------------------------------------------------------
# SAUVEGARDE DataFrame → S3
# ---------------------------------------------------------------------------

def save_df_to_s3(df: pd.DataFrame, bucket: str, key: str) -> None:
    """
    Sauvegarde un DataFrame pandas dans S3 au format CSV ou Parquet.

    Parameters
    ----------
    df : pd.DataFrame
        Le DataFrame à sauvegarder.
    bucket : str
        Nom du bucket S3.
    key : str
        Chemin du fichier dans S3 (ex: "output/2026/result.csv").

    Raises
    ------
    ValueError
        Si l'extension n'est pas supportée.
    ClientError
        Si la sauvegarde S3 échoue.
    """

    logger.info(f"Sauvegarde S3 → bucket={bucket}, key={key}")

    s3 = _get_s3_client()

    # Préparation du buffer selon le format
    if key.endswith(".csv"):
        buffer = StringIO()
        df.to_csv(buffer, index=False)
        body = buffer.getvalue()

    elif key.endswith(".parquet"):
        buffer = BytesIO()
        df.to_parquet(buffer, index=False)
        body = buffer.getvalue()

    else:
        raise ValueError("Extension non supportée (csv ou parquet uniquement).")

    try:
        s3.put_object(Bucket=bucket, Key=key, Body=body)
        logger.info("Sauvegarde OK")

    except ClientError as e:
        logger.error(f"Erreur S3 lors de la sauvegarde : {e}")
        raise


# ---------------------------------------------------------------------------
# UTILITAIRES OPTIONNELS
# ---------------------------------------------------------------------------

def s3_file_exists(bucket: str, key: str) -> bool:
    """
    Vérifie si un fichier existe dans S3.

    Returns
    -------
    bool
        True si le fichier existe, False sinon.
    """
    s3 = _get_s3_client()

    try:
        s3.head_object(Bucket=bucket, Key=key)
        return True
    except ClientError:
        return False

