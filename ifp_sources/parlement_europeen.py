import pandas as pd
from pathlib import Path
import logging
from datetime import datetime

from files_utils import (
    export_and_copy_dbt_source_data,
    check_dossiers_et_télécharge_raw_data,
)
from utils_date_age import nettoie_date, calcul_age

logger = logging.getLogger(__name__)

#################### Paths and URLs ####################
# URLs - Format csv
URL_PARLEMENT_EUROPEEN_FR = (
    "https://www.data.gouv.fr/api/1/datasets/r/70957bb0-f19f-40c5-b97b-90b3d4d71f9e"
)


PARLEMENT_EUROPEEN_RAW_FILENAME = "parlement_europeen_raw"
PARLEMENT_EUROPEEN_FILENAME = "parlement_europeen"


#################### Traitements des données ####################


def reduit_parlement_europeen_data(
    df_raw: pd.DataFrame, date_elections: datetime | None = None
) -> pd.DataFrame | None:
    try:
        # Garder uniquement les colonnes utiles et les renommer

        df = df_raw[
            [
                "Nom de l'élu",
                "Prénom de l'élu",
                "Code sexe",
                "Date de naissance",
                "Code de la catégorie socio-professionnelle",
            ]
        ]
        df.rename(
            columns={
                "Nom de l'élu": "nom",
                "Prénom de l'élu": "prenom",
                "Code sexe": "genre",
                "Date de naissance": "date_naissance",
                "Code de la catégorie socio-professionnelle": "code_CSP",
            },
            inplace=True,
        )

        # Nettoyage des dates invalides
        df["date_naissance"] = df["date_naissance"].apply(nettoie_date)

        # Calcul de l'âge
        ref_date = date_elections or datetime.now()
        df["age"] = df["date_naissance"].apply(lambda x: calcul_age(x, ref_date))
        return df

    except Exception as e:
        logging.error(f"❌ Erreur dans reduit_parlement_europeen_data : {e}")
        return None


#################### END Fonctions ####################


def get_parlement_europeen_data(
    année: int,
    output_dir: str,
    seeds_dir: str,
    telechargement: bool = False,
    date_elections: datetime | None = None,
):
    try:
        # --- 1. Vérification des dossiers & telechargement raw data---
        output_path = Path(output_dir)
        seeds_path = Path(seeds_dir)

        df_raw = check_dossiers_et_télécharge_raw_data(
            année,
            output_path,
            seeds_path,
            URL_PARLEMENT_EUROPEEN_FR,
            PARLEMENT_EUROPEEN_RAW_FILENAME,
            "csv",
            telechargement,
        )

        # --- 2. Réduit les données ---
        logging.info(f"Traitement des données {PARLEMENT_EUROPEEN_RAW_FILENAME} ")
        try:
            df = reduit_parlement_europeen_data(df_raw, date_elections)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des données : {e}")

        export_and_copy_dbt_source_data(
            df, année, output_path, seeds_path, PARLEMENT_EUROPEEN_FILENAME
        )

        print(f"✔ Traitement des parlementaires européens terminé pour l'année {année}")
        return True

    except Exception as e:
        print(f"❌ Erreur dans get_parlement_europeen_data({année}) : {e}")
        return False
