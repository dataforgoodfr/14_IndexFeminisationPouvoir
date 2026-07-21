import requests
import pandas as pd
import json
import shutil
from pathlib import Path
import csv
import logging
import os

from files_utils import get_df_from_url_parquet, export_fichier_csv, export_and_copy_dbt_source_data, check_dossiers_et_télécharge_raw_data

logger = logging.getLogger(__name__)

#################### Paths and URLs ####################
# URL du source -  format parquet
URL = "https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/exports/parquet?lang=fr"

ADMINISTRATION_RAW_FILENAME = "administration_raw"
ADMINISTRATION_FILENAME = "administration"
ADMIN_HIER_FILENAME = "administration_hierarchies"


#################### Traitements des données annuaire de l'administration ####################

def filtre_et_parse_annu_admin_data(df_raw: pd.DataFrame)-> pd.DataFrame | None:
    try:
        # Filtrer les lignes
        df = df_raw[
            (df_raw["affectation_personne"].notna()) &
            (df_raw["affectation_personne"] != "") &
            (df_raw["categorie"] != "SL")]

        # Garder uniquement les colonnes utiles
        df = df[["nom", "affectation_personne", "categorie", "type_organisme", "code_insee_commune"]]
        df = df.rename(columns={"nom": "administration"})

        #explode affectation_personne
        return explode_affectations(df)
    except Exception as e:
        logging.error(f"❌ Erreur lors du filtrage/parsing : {e}")
        raise

def explode_affectations(df)-> pd.DataFrame | None:
    rows = []
    for _, row in df.iterrows():
        # Parse la liste JSON
        try:
            affectations = json.loads(row["affectation_personne"])
        except Exception:
            affectations = []
        #génère les lignes pour chaque affectation
        for item in affectations:
            personne = item.get("personne", {}) or {}
            rows.append({
                "administration": row["administration"],
                "nom": personne.get("nom"),
                "prenom": personne.get("prenom"),
                "civilite": personne.get("civilite"),
                "grade": personne.get("grade"),
                "fonction": item.get("fonction"),
                "categorie": row["categorie"],
                "type_organisme": row["type_organisme"],
                "code_insee_commune": row["code_insee_commune"]
            })


    return pd.DataFrame(rows)


def filtre_et_parse_annu_admin_hierarchie (df_raw: pd.DataFrame)-> pd.DataFrame | None:
    # Filtrer les lignes
    df = df_raw[
        (df_raw["categorie"] != "SL") 
        # & (df_raw["hierarchie"].notna())
        # & (df_raw["hierarchie"] != "")
        ]

    # Garder uniquement les colonnes utiles
    df = df[["nom", "id", "hierarchie"]] # df[["nom", "id", "categorie", "type_organisme", "hierarchie"]]
    df = df.rename(columns={"nom": "administration"})

    #explode affectation_personne
    return extract_sous_administrations(df)



def extract_sous_administrations(df)-> pd.DataFrame | None:
    rows = []

    # Indexer les administrations par id pour lookup rapide
    id_to_admin = df.set_index("id")["administration"].to_dict()

    for _, row in df.iterrows():
        admin_name = row["administration"]

        # Parse hierarchie JSON
        try:
            hier = json.loads(row["hierarchie"]) if row["hierarchie"] else []
        except Exception:
            hier = []

        # Extraire les sous-administrations
        for item in hier:
            sous_id = item.get("service")
            if sous_id in id_to_admin:
                rows.append({
                    "administration": admin_name,
                    "sous_administration": id_to_admin[sous_id]
                })

    return pd.DataFrame(rows)



#################### END Fonctions ####################

#################### Main ####################

def get_annu_admin_data(année: int, output_dir: str, seeds_dir: str, telechargement: bool = False):
    try:
        # --- 1. Vérification des dossiers & telechargement raw data---
        output_path = Path(output_dir)
        seeds_path = Path(seeds_dir)

        df_raw = check_dossiers_et_télécharge_raw_data(année, output_path, seeds_path, URL, ADMINISTRATION_RAW_FILENAME, "parquet", telechargement)

        # --- 2. Filtrer et parser les données ---
        logging.info(f"Traitement des données {ADMINISTRATION_FILENAME} ")
        try:
            df = filtre_et_parse_annu_admin_data(df_raw)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des données : {e}")

        export_and_copy_dbt_source_data(df, année, output_path, seeds_path, ADMINISTRATION_FILENAME)
        
        # --- 3. Parser les hiérarchies ---
        logging.info(f"Traitement des données {ADMIN_HIER_FILENAME} ")
        try:
            df_h = filtre_et_parse_annu_admin_hierarchie(df_raw)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des hiérarchies : {e}")
        
        export_and_copy_dbt_source_data(df_h, année, output_path, seeds_path, ADMIN_HIER_FILENAME)

        print(f"✔ Traitement annuaire de l'administration terminé pour l'année {année}")
        return True

    except Exception as e:
        print(f"❌ Erreur dans get_annu_admin_data({année}) : {e}")
        return False
