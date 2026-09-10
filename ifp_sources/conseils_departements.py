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
URL_CONSEILS_DEPARTEMENTS = (
    "https://www.data.gouv.fr/api/1/datasets/r/601ef073-d986-4582-8e1a-ed14dc857fba"
)


CONSEILS_DEPARTEMENTS_RAW_FILENAME = "conseils_departements_raw"
CONSEILS_DEPARTEMENTS_FILENAME = "conseils_departements"


#################### Traitements des données des municipales ####################


def reduit_conseils_departements_data(
    df_raw: pd.DataFrame, date_elections: datetime | None = None
) -> pd.DataFrame | None:
    try:
        # Garder uniquement les colonnes utiles et les renommer
        # "Libellé de la collectivité à statut particulier";"Code de la commune";"Libellé de la commune";"Nom de l'élu";"Prénom de l'élu";"Code sexe";"Date de naissance";"Code de la catégorie socio-professionnelle";"Libellé de la catégorie socio-professionnelle";"Date de début du mandat";"Libellé de la fonction";"Date de début de la fonction";"Code nationalité"
        df = df_raw[
            [
                "Code du département",
                "Code du canton",
                "Libellé du canton",
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
                "Code du département": "code_departement",
                "Code du canton": "code_canton",
                "Libellé du canton": "libelle_canton",
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
        logging.error(f"❌ Erreur dans reduit_conseils_departements_data : {e}")
        return None


def get_conseils_departements_data(
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
            URL_CONSEILS_DEPARTEMENTS,
            CONSEILS_DEPARTEMENTS_RAW_FILENAME,
            "csv",
            telechargement,
        )

        # --- 2. Réduit les données ---
        logging.info(f"Traitement des données {CONSEILS_DEPARTEMENTS_RAW_FILENAME} ")
        try:
            df = reduit_conseils_departements_data(df_raw, date_elections)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des données : {e}")

        export_and_copy_dbt_source_data(
            df, année, output_path, seeds_path, CONSEILS_DEPARTEMENTS_FILENAME
        )

        print(f"✔ Traitement des conseils départementaux terminé pour l'année {année}")
        return True

    except Exception as e:
        print(f"❌ Erreur dans get_conseils_departements_data({année}) : {e}")
        return False
