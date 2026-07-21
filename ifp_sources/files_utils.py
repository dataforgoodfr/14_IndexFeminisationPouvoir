
import requests
from pathlib import Path
import pandas as pd
import logging
import shutil
import csv
import os
import zipfile

logger = logging.getLogger(__name__)


#################### Fonctions téléchargement parquet ####################

def telecharger_parquet(url: str, parquet_path: str)->bool:
    """
    Télécharge un fichier .parquet depuis une URL et le sauvegarde localement.
    Ne lit pas le fichier et ne retourne pas de DataFrame.
    """

    logging.info(
        f"📥 Téléchargement des données\n"
        f"    → URL : {url}\n"
        f"    → Fichier : {parquet_path}"
    )

    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()

        with open(parquet_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        logging.info(f"📥 Fichier téléchargé : {parquet_path}")
        return True

    except Exception as e:
        logging.error(f"❌ Erreur lors du téléchargement du parquet : {e}")
        raise

def get_df_from_url_parquet(url: str, parquet_path: str, telechargement: bool = False) -> pd.DataFrame | None:
    try:
        # Téléchargement
        if telechargement:
            bOK = telecharger_parquet(url, parquet_path)
            if not bOK:
                logging.error("❌ Téléchargement échoué — abandon du chargement Parquet.")
                return None

        # Lecture du parquet
        df = pd.read_parquet(parquet_path)

        # Homogénéisation des types
        df = df.astype(str)

        logging.info("✅ Parquet chargé et converti en DataFrame (types homogénéisés).")
        return df

    except Exception as e:
        logging.error(f"❌ Erreur lors du chargement/parse du Parquet : {e}")
        return None


#################### Fonctions téléchargement CSV ####################

def telecharger_csv(url: str, csv_path: str)->bool: 
    logging.info(
        f"📥 Téléchargement des données\n"
        f"    → URL : {url}\n"
        f"    → Fichier : {csv_path}"
     )
    try:
        response = requests.get(url, stream=True, timeout=20)
        response.raise_for_status()

        with open(csv_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        logging.info(f"📥 Fichier téléchargé : {csv_path}")
        return True

    except Exception as e:
        logging.error(f"❌ Erreur lors du téléchargement du CSV : {e}")
        return False


def get_df_from_url_csv (url: str, csv_path: str, telechargement: bool = False) -> pd.DataFrame | None:
    try:
        # Téléchargement
        if telechargement:
            bOK = telecharger_csv(url, csv_path)
            if not bOK:
                logging.error("❌ Téléchargement échoué — abandon du chargement CSV.")
                return None

        # Lecture du CSV
        df = pd.read_csv(csv_path,
                sep=";",
                quotechar='"',
                encoding="utf-8",
                engine="python")

        # Homogénéisation des types
        df = df.astype(str)

        logging.info("✅ CSV chargé et converti en DataFrame (types homogénéisés).")
        return df

    except Exception as e:
        logging.error(f"❌ Erreur lors du chargement/parse du CSV : {e}")
        return None

#################### Fonctions export et copy csv ####################

def export_fichier_csv(df, csv_path, csv_sep): 
    df.to_csv(csv_path, index=False, encoding="utf-8-sig", 
                sep=csv_sep, quotechar='"', quoting=csv.QUOTE_MINIMAL)
    print("Fichier  généré :", csv_path)


def export_and_copy_dbt_source_data(df: pd.DataFrame, année: int, output_path: Path, seeds_path: Path, filename: str):
    logging.info(f"Sauvegarde des données {filename} vers {output_path} et {seeds_path}")
    try :
        # Export des données csv
        data_csv_path = output_path / f"{filename}_{année}.csv"
        export_fichier_csv(df, data_csv_path, ",")

        # Copie vers dbt seeds ---
        seeds_csv_path = seeds_path / f"{filename}_{année}.csv"
        shutil.copyfile(data_csv_path, seeds_csv_path)
    except Exception as e:
        raise RuntimeError(f"Erreur lors de la copie vers seeds : {e}")
    
    logging.info(f"Fin de traitement des données {filename} - Fichiers {data_csv_path} et {seeds_csv_path}")

#################### Fonctions check dossiers et lance téléchargement si requis ####################

def check_dossiers_et_télécharge_raw_data(année: int, output_path: Path, seeds_path: Path, URL: str, filename: str, type: str = "parquet", telechargement: bool = False)-> pd.DataFrame | None:
    try:
        # --- 0. Vérification des dossiers ---
        if not output_path.exists():
            raise FileNotFoundError(f"Le dossier output_dir n'existe pas : {output_path}")

        if not seeds_path.exists():
            raise FileNotFoundError(f"Le dossier seeds_dir n'existe pas : {seeds_path}")

        # --- 1. Télécharger le fichier brut ---
        raw_path = output_path / f"{filename}_{année}.{type}"

        if not raw_path.exists():
            telechargement = True

        if type == "parquet":
            df_raw = get_df_from_url_parquet(URL, raw_path, telechargement)
        elif type == "csv":
            df_raw = get_df_from_url_csv(URL, raw_path, telechargement)
        else:
            logging.info(f"Type de fichier {type} inconnu dans  heck_dossiers_et_télécharge_raw_data pour {filename}")
        return df_raw
    
    except Exception as e:
        raise RuntimeError(f"Erreur lors du chargement de {raw_path}: {e}")

########################## ZIP file #########################

def telecharger_zip(url: str, zip_path: str)->bool:
    """
    Télécharge un fichier .zip depuis une URL et le sauvegarde localement.
    Ne lit pas le fichier et ne retourne pas de DataFrame.
    """

    logging.info(
        f"📥 Téléchargement des données\n"
        f"    → URL : {url}\n"
        f"    → Fichier : {zip_path}"
    )

    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()

        with open(zip_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        logging.info(f"📥 Fichier téléchargé : {zip_path}")
        return True

    except Exception as e:
        logging.error(f"❌ Erreur lors du téléchargement du zip : {e}")
        return False

import zipfile
import logging
from pathlib import Path

def dezip_fichier(zip_path: Path, output_dir: Path, fichiers_a_extraire: list[str] | None) -> bool:
    """
    Dézippe un fichier ZIP.
    - Si fichiers_a_extraire est None → extrait tout.
    - Sinon → extrait uniquement les fichiers de la liste.
    Retourne True si OK, False si erreur.
    """

    logger = logging.getLogger(__name__)

    try:
        logger.info(f"📦 Décompression du ZIP : {zip_path}")

        if not zip_path.exists():
            logger.error(f"❌ Fichier ZIP introuvable : {zip_path}")
            return False

        output_dir.mkdir(parents=True, exist_ok=True)

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            contenu_zip = zip_ref.namelist()
            logger.info(f"📄 Contenu ZIP : {contenu_zip}")

            # --- Extraction totale ---
            if fichiers_a_extraire is None:
                logger.info("➡ Aucun filtre fourni → extraction de tous les fichiers")
                zip_ref.extractall(output_dir)
                logger.info(f"✅ Extraction complète terminée dans : {output_dir}")
                return True

            # --- Extraction sélective ---
            fichiers_trouves = [f for f in contenu_zip if f in fichiers_a_extraire]

            if not fichiers_trouves:
                logger.warning("⚠ Aucun fichier demandé n'est présent dans le ZIP.")
                return False

            for f in fichiers_trouves:
                logger.info(f"➡ Extraction : {f}")
                zip_ref.extract(f, output_dir)

        logger.info(f"✅ Extraction sélective terminée dans : {output_dir}")
        return True

    except zipfile.BadZipFile:
        logger.error(f"❌ ZIP corrompu : {zip_path}")
        return False

    except Exception as e:
        logger.error(f"❌ Erreur inattendue dans dezip_fichier : {e}")
        return False



def get_zip_files(année: int, output_path: Path, seeds_path: Path, URL: str, filename: str, sub_dir:str, fichiers_a_extraire: list[str] | None, telechargement: bool = False)-> bool:
    try:
        # --- 0. Vérification des dossiers ---
        if not output_path.exists():
            raise FileNotFoundError(f"Le dossier output_dir n'existe pas : {output_path}")

        # --- 1. Télécharger le fichier brut ---
        zip_path = output_path / filename
        output_sub_dir_path = output_path / sub_dir

        if not zip_path.exists():
            telechargement = True
            
        if telechargement:
            bOK= telecharger_zip(URL, zip_path)
        else:
            bOK = True
        
        if bOK:
            bOK = dezip_fichier(zip_path, output_sub_dir_path, fichiers_a_extraire)

        if bOK:
             # Copie vers dbt seeds ---
            shutil.copytree(output_sub_dir_path, seeds_path, dirs_exist_ok=True)
            logger.info(f"📁 Copie complète OK : {output_sub_dir_path} → {seeds_path}")

        return bOK
    except Exception as e:
        logger.error(f"Erreur lors du chargement de {filename}: {e}")
        return False
