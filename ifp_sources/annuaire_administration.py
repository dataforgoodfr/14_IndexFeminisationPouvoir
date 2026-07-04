import requests
import pandas as pd
import json
import shutil
from pathlib import Path
import csv
import logging
import os

logger = logging.getLogger(__name__)

#################### Paths and URLs ####################
# URL du source -  format parquet
URL = "https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/exports/parquet?lang=fr"

ADMINISTRATION_RAW_FILENAME = "administration_raw"
ADMINISTRATION_FILENAME = "administration"
ADMIN_HIER_FILENAME = "administration_hierarchies"


#################### Fonctions parquet ####################

def telecharger_parquet(url: str, parquet_path: str):
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
        print("Parquet téléchargé :", parquet_path)

    except Exception as e:
        logging.error(f"❌ Erreur lors du téléchargement du parquet : {e}")
        raise


def filtre_et_parse_data_parquet(parquet_path: str):
    try:
        # Charger le fichier parquet
        df = pd.read_parquet(parquet_path)

        # Homogénéiser les types pour éviter les erreurs de comparaison / explode
        df = df.astype(str)

        # Filtrer les lignes
        df = df[
            (df["affectation_personne"].notna()) &
            (df["affectation_personne"] != "") &
            (df["categorie"] != "SL")
        ]

        # Colonnes utiles
        df = df[[
            "nom",
            "affectation_personne",
            "categorie",
            "type_organisme",
            "code_insee_commune"
        ]]

        df = df.rename(columns={"nom": "administration"})

        return explode_affectations(df)

    except Exception as e:
        logging.error(f"❌ Erreur lors du filtrage/parsing : {e}")
        raise


#################### Fonctions CSV ####################

def telecharger_csv(url, csv_path): 
    logging.info(
        f"📥 Téléchargement des données\n"
        f"    → URL : {url}\n"
        f"    → Fichier : {csv_path}"
     )
    response = requests.get(url, stream=True)
    response.raise_for_status()

    with open(csv_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    logging.info(
        f"📥 Fichier téléchargé : {csv_path}"
     )
    print("CSV téléchargé :", csv_path)



def filtre_et_parse_data(df_raw: pd.DataFrame):

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

def explode_affectations(df):
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


def filtre_et_parse_hierarchie (df_raw: pd.DataFrame):
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

def extract_sous_administrations(df):
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


def export_fichier_csv(df, csv_path, csv_sep): 
    df.to_csv(csv_path, index=False, encoding="utf-8-sig", 
                sep=csv_sep, quotechar='"', quoting=csv.QUOTE_MINIMAL)
    print("Fichier  généré :", csv_path)



#################### END Fonctions ####################

#################### Main ####################

def get_annu_admin_data(année: int, output_dir: str, seeds_dir: str, telechargement: bool = False):
    try:
        # --- 0. Vérification des dossiers ---
        output_path = Path(output_dir)
        seeds_path = Path(seeds_dir)

        if not output_path.exists():
            raise FileNotFoundError(f"Le dossier output_dir n'existe pas : {output_path}")

        if not seeds_path.exists():
            raise FileNotFoundError(f"Le dossier seeds_dir n'existe pas : {seeds_path}")

        # --- 1. Télécharger le fichier brut ---
        raw_path = output_path / f"{ADMINISTRATION_RAW_FILENAME}_{année}.parquet"

        if telechargement or not raw_path.exists():
            try:
                telecharger_parquet(URL, raw_path)
            except Exception as e:
                raise RuntimeError(f"Erreur lors du téléchargement du CSV : {e}")
        else:
            logging.info("Fichier raw NON téléchargé :", raw_path)

        if not raw_path.exists():
            raise FileNotFoundError(f"Le fichier brut n'existe pas après téléchargement : {raw_path}")
        else:
            # Charger le fichier parquet
            df_raw = pd.read_parquet(raw_path)
            # Homogénéiser les types pour éviter les erreurs de comparaison / explode
            df_raw = df_raw.astype(str)

        # --- 2. Filtrer et parser les données ---
        logging.info(f"Traitement des données {ADMINISTRATION_FILENAME} ")
        try:
            df = filtre_et_parse_data(df_raw)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des données : {e}")

        # --- 3. Export des données filtrées ---
        data_csv_path = output_path / f"{ADMINISTRATION_FILENAME}_{année}.csv"

        try:
            export_fichier_csv(df, data_csv_path, ",")
        except Exception as e:
            raise RuntimeError(f"Erreur lors de l'export du CSV filtré : {e}")

        # --- 4. Copie vers dbt seeds ---
        seeds_csv_path = seeds_path / f"{ADMINISTRATION_FILENAME}_{année}.csv"

        try:
            shutil.copyfile(data_csv_path, seeds_csv_path)
        except Exception as e:
            raise RuntimeError(f"Erreur lors de la copie vers seeds : {e}")
        logging.info(f"Fin de traitement des données {ADMINISTRATION_FILENAME} - Fichier {data_csv_path} et {seeds_csv_path}")

        # --- 5. Parser les hiérarchies ---
        logging.info(f"Traitement des données {ADMIN_HIER_FILENAME} ")
        try:
            df_h = filtre_et_parse_hierarchie(df_raw)
        except Exception as e:
            raise RuntimeError(f"Erreur lors du parsing des hiérarchies : {e}")

        # --- 6. Export des hiérarchies ---
        data_hier_csv_path = output_path / f"{ADMIN_HIER_FILENAME}_{année}.csv"

        try:
            export_fichier_csv(df_h, data_hier_csv_path, ",")
        except Exception as e:
            raise RuntimeError(f"Erreur lors de l'export des hiérarchies : {e}")

        # --- 7. Copie vers seeds ---
        seeds_hier_csv_path = seeds_path / f"{ADMIN_HIER_FILENAME}_{année}.csv"

        try:
            shutil.copyfile(data_hier_csv_path, seeds_hier_csv_path)
        except Exception as e:
            raise RuntimeError(f"Erreur lors de la copie des hiérarchies vers seeds : {e}")
        
        logging.info(f"Fin de traitement des données {ADMIN_HIER_FILENAME} - Fichier {data_hier_csv_path} et {seeds_hier_csv_path}")
        print(f"✔ Traitement terminé pour l'année {année}")
        return True

    except Exception as e:
        print(f"❌ Erreur dans get_annu_admin_data({année}) : {e}")
        return False
