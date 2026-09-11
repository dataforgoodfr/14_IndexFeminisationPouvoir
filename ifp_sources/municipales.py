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
URL_Mairies = (
    "https://www.data.gouv.fr/api/1/datasets/r/d5f400de-ae3f-4966-8cb6-a85c70c6c24a"
)
URL_Mairies_PLM_Arr = (
    "https://www.data.gouv.fr/api/1/datasets/r/3b6b2281-b9d9-4959-ae9d-c2c166dff118"
)

MAIRIES_RAW_FILENAME = "mairies_raw"
MAIRIES_FILENAME = "mairies"
MAIRIES_PLM_ARR_RAW_FILENAME = "mairies_plm_arr_raw"
MAIRIES_PLM_ARR_FILENAME = "mairies_plm_arr"


#################### Traitements des données des municipales ####################


def reduit_mairies_data(
    df_raw: pd.DataFrame, date_elections: datetime | None = None
) -> pd.DataFrame | None:
    try:
        # Garder uniquement les colonnes utiles et les renommer
        # "Libellé de la collectivité à statut particulier";"Code de la commune";"Libellé de la commune";"Nom de l'élu";"Prénom de l'élu";"Code sexe";"Date de naissance";"Code de la catégorie socio-professionnelle";"Libellé de la catégorie socio-professionnelle";"Date de début du mandat";"Libellé de la fonction";"Date de début de la fonction";"Code nationalité"
        df = df_raw[
            [
                "Code de la commune",
                "Code de la collectivité à statut particulier",
                "Nom de l'élu",
                "Prénom de l'élu",
                "Code sexe",
                "Date de naissance",
                "Code de la catégorie socio-professionnelle",
                "Libellé de la fonction",
                "Code nationalité",
            ]
        ]
        df.rename(
            columns={
                "Code de la commune": "code_commune",
                "Code de la collectivité à statut particulier": "code_collectivite_statut_particulier",
                "Nom de l'élu": "nom",
                "Prénom de l'élu": "prenom",
                "Code sexe": "genre",
                "Date de naissance": "date_naissance",
                "Code de la catégorie socio-professionnelle": "code_CSP",
                "Libellé de la fonction": "fonction",
                "Code nationalité": "code_nationalite",
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
        logging.error(f"❌ Erreur dans reduit_mairies_data : {e}")
        return None


def reduit_mairies_plm_arr_data(
    df_raw: pd.DataFrame, date_elections: datetime | None = None
) -> pd.DataFrame | None:
    try:
        # Garder uniquement les colonnes utiles et les renommer
        # "Code du département";"Libellé du département";"Code de la commune";"Libellé de la commune";"Libellé du secteur";"Nom de l'élu";"Prénom de l'élu";"Code sexe";"Date de naissance";"Code de la catégorie socio-professionnelle";"Libellé de la catégorie socio-professionnelle";"Date de début du mandat";"Libellé de la fonction";"Date de début de la fonction"
        df = df_raw[
            [
                "Code de la commune",
                "Libellé du secteur",
                "Nom de l'élu",
                "Prénom de l'élu",
                "Code sexe",
                "Date de naissance",
                "Code de la catégorie socio-professionnelle",
                "Libellé de la fonction",
            ]
        ]
        df.rename(
            columns={
                "Code de la commune": "code_commune",
                "Libellé du secteur": "secteur",
                "Nom de l'élu": "nom",
                "Prénom de l'élu": "prenom",
                "Code sexe": "genre",
                "Date de naissance": "date_naissance",
                "Code de la catégorie socio-professionnelle": "code_CSP",
                "Libellé de la fonction": "fonction",
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
        logging.error(f"❌ Erreur dans reduit_mairies_plm_arr_data : {e}")
        return None


#################### END Fonctions ####################

#################### Main ####################


def get_mairies_all_data(
    année: int,
    output_dir: str,
    seeds_dir: str,
    telechargement: bool = False,
    date_elections: datetime | None = None,
):
    return get_mairies_data(
        année, output_dir, seeds_dir, telechargement, date_elections
    ) and get_mairies_plm_arr_data(
        année, output_dir, seeds_dir, telechargement, date_elections
    )


def get_mairies_plm_arr_data(
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
            URL_Mairies_PLM_Arr,
            MAIRIES_PLM_ARR_RAW_FILENAME,
            "csv",
            telechargement,
        )
        print(df_raw.columns)

        # --- 2. Réduit les données ---
        logging.info(f"Traitement des données {MAIRIES_PLM_ARR_RAW_FILENAME} ")
        try:
            df = reduit_mairies_plm_arr_data(df_raw, date_elections)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des données : {e}")

        export_and_copy_dbt_source_data(
            df, année, output_path, seeds_path, MAIRIES_PLM_ARR_FILENAME
        )

        print(f"✔ Traitement des mairies terminé pour l'année {année}")
        return True

    except Exception as e:
        print(f"❌ Erreur dans get_mairies_data({année}) : {e}")
        return False


def get_mairies_data(
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
            URL_Mairies,
            MAIRIES_RAW_FILENAME,
            "csv",
            telechargement,
        )

        # --- 2. Réduit les données ---
        logging.info(f"Traitement des données {MAIRIES_RAW_FILENAME} ")
        try:
            df = reduit_mairies_data(df_raw, date_elections)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des données : {e}")

        export_and_copy_dbt_source_data(
            df, année, output_path, seeds_path, MAIRIES_FILENAME
        )

        print(f"✔ Traitement des mairies terminé pour l'année {année}")
        return True

    except Exception as e:
        print(f"❌ Erreur dans get_mairies_data({année}) : {e}")
        return False
