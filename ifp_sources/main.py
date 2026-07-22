# extract_and_export.py  ←  MAIN
import os
from datetime import datetime
from pathlib import Path
from pyexpat import model
import sys
import logging
import argparse 
import json
print("SYS ARGV =",     sys.argv)

from utils_env import load_env_file
from annuaire_administration import get_annu_admin_data
from export_xls_to_csv import excel_to_csv_all_sheets
from dbt_run import dbt_run_sources_and_exports, delete_seeds_oxfam, get_dbt_used_schema, get_dbt_models_from_tags, dbt_run_oxfam_validated_data, init_seeds_oxfam, delete_seeds_oxfam
from export_db_to_xls import run_exports
from clean_utils import clean_db_tables_and_views, empty_folder
from export_to_json import generate_json_executif, generate_json_pouvoirs
from municipales import get_mairies_all_data
from decoupage_territorial import get_GOG_data

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log", encoding="utf-8"),
        logging.StreamHandler()
    ]
)


# Dossier du fichier courant : .../ifp_sources
CURRENT_DIR = Path(__file__).resolve().parent

# Racine du projet : remonter d'un cran
BASE_DIR = CURRENT_DIR.parent

# Chemins
DBT_DIR = BASE_DIR / "dbt_ifp"
ENV_FILEPATH = BASE_DIR /  ".env"
DBT_SEEDS_DIR = DBT_DIR / "seeds"
DBT_SEEDS_SOURCES_DIR = DBT_SEEDS_DIR / "sources"
DBT_SEEDS_REF_DIR = DBT_SEEDS_DIR / "référentiels"
DBT_SEEDS_TERRITOIRE_DIR = DBT_SEEDS_DIR / "territoire"
DBT_SEEDS_OXFAM_DIR = DBT_SEEDS_DIR / "oxfam"
DATA_DIR = BASE_DIR / "data"
REF_XL_FILENAME = "IFP_réferentiels"
DATA_ADMIN_DIR = DATA_DIR / "administration"
DATA_MAIRIES_DIR = DATA_DIR / "mairies"
DATA_REF_DIR = DATA_DIR / "référentiels"
DATA_TERRITOIRE_DIR = DATA_DIR / "territoire"
DATA_EXPORTS_DIR = DATA_DIR / "exports"
DATA_OXFAM_DIR = DATA_DIR / "oxfam"
ADM_OXFAM_XL_FILENAME = "administration_oxfam"
DATA_JSON_DIR = DATA_DIR / "json"
JSON_POUVOIRS_NAME = "pouvoirs.json"
JSON_EXECUTIF_NAME = "pouvoir_executif.json"

def init_env_dbt()-> str:
    # Vérification ENV_FILEPATH
    env_path = Path(ENV_FILEPATH)
    if not env_path.exists():
        raise FileNotFoundError(f"❌ Le fichier d'environnement est introuvable : {env_path}")

    # Charger les variables d'environnement
    load_env_file(ENV_FILEPATH)  

    # Vérification DBT_DIR
    dbt_project_path = Path(DBT_DIR)
    if not dbt_project_path.exists():
        raise FileNotFoundError(f"❌ Le dossier DBT_DIR est introuvable : {dbt_project_path}")

    # Indiquer à dbt où se trouve profiles.yml
    os.environ["DBT_PROFILES_DIR"] = str(dbt_project_path)
    return dbt_project_path


def export_data_seeds_xl_to_csv(annee: int, xl_filename:str, data_dir: Path, seeds_dir: Path, suffix: str | None = None):
    xl_filepath = data_dir / f"{xl_filename}_{annee}.xlsx"
    if not xl_filepath.exists():
        raise FileNotFoundError(f"❌ Le fichier xl est introuvable : {xl_filepath}")
    return excel_to_csv_all_sheets (annee, xl_filepath, data_dir, seeds_dir, suffix=suffix)

# -------------------------
# PIPELINE 1 : EXTRACT AND EXPORT
# -------------------------
def pipeline_extract_and_export(annee: int, telechargement: bool = True,
                                load_referentiels: bool=True, load_territoire: bool=True, load_sources: bool=True):
    
    logging.info("--------------------------------------------------------------------------")
    logging.info(f"--- Début des traitements Extract and Export pour l'année {annee} ")
    
    if load_referentiels:
        # Export fichiers référentiels à partir du fichier XL sources annuaire 
        ref_xl_filepath = DATA_REF_DIR / f"{REF_XL_FILENAME}_{annee}.xlsx"
        if not ref_xl_filepath.exists():
            raise FileNotFoundError(f"❌ Le fichier xl référentiel est introuvable : {ref_xl_filepath}")
        bOK = excel_to_csv_all_sheets (annee, ref_xl_filepath, DATA_REF_DIR, DBT_SEEDS_REF_DIR)
        if not bOK:
            sys.exit(1)   # échec

    if load_sources:
        # Charge sources annuaire administration
        get_annu_admin_data(annee, DATA_ADMIN_DIR, DBT_SEEDS_SOURCES_DIR, telechargement)
        # Charge sources mairies
        bOK = get_mairies_all_data (annee, DATA_MAIRIES_DIR, DBT_SEEDS_SOURCES_DIR, telechargement)

    if load_territoire:
        # Charge territoire COG Code Officiel Géographique 
        bOK = get_GOG_data (annee, DATA_TERRITOIRE_DIR, DBT_SEEDS_TERRITOIRE_DIR, telechargement)

    # if not bOK:
    #     sys.exit(1)   # échec
    # # # sys.exit(0)

    #Load env en init dbt profiles
    dbt_project_path = init_env_dbt()

    # Créee les seeds oxfam pour pouvoir faire tourner dbt
    init_seeds_oxfam(annee, DBT_SEEDS_OXFAM_DIR)

    # Lancer le pipeline dbt
    dbt_run_sources_and_exports(str(dbt_project_path), annee, load_referentiels, load_territoire, load_sources)

    # #exports_schema = get_dbt_used_schema(str(dbt_project_path), annee, "exports")


    export_models = get_dbt_models_from_tags(str(dbt_project_path), "exports")
    if export_models is None:
         logging.info(f"--- Pas de dbt exports models ---- ")
    else:
        bOK = run_exports(annee, export_models, DATA_EXPORTS_DIR, f"administration_exports_{annee}")
        logging.info(f"--- Fin des traitements Extract and Export pour l'année {annee} - bOK = {bOK}")
    logging.info("--------------------------------------------------------------------------")


# -------------------------
# PIPELINE 2 : IMPORT OXFAM DATA AND GENERATE JSON
# -------------------------
def pipeline_import_and_generate(annee: int, db_schema:str, seeds: bool=True):
    logging.info("--------------------------------------------------------------------------")
    logging.info(f"--- Début des traitements Import and Generate pour l'année {annee} ")
    
    # Load env et init dbt profiles
    dbt_project_path = init_env_dbt()
    
    # Export données modifiées par Oxfam à partir du fichier XL
    if seeds:
        # Delete les seeds oxfam créés pour pouvoir faire tourner dbt
        delete_seeds_oxfam(annee, DBT_SEEDS_OXFAM_DIR)
        # Delete les tables
        clean_db_tables_and_views(annee, "import", "sources")
        bOK = export_data_seeds_xl_to_csv(annee, ADM_OXFAM_XL_FILENAME, DATA_OXFAM_DIR, DBT_SEEDS_OXFAM_DIR, "oxfam")
        if not bOK:
            sys.exit(1)   # échec

    # Lancer le pipeline dbt 
    dbt_run_oxfam_validated_data (str(dbt_project_path), annee, seeds)

    #exports_schema = get_dbt_used_schema(str(dbt_project_path), annee, "exports")

    generate_json_executif(annee, f"{db_schema}.calc_executif_oxfam", DATA_JSON_DIR / JSON_EXECUTIF_NAME)
    generate_json_pouvoirs(annee,  db_schema, DATA_JSON_DIR / JSON_POUVOIRS_NAME)
    logging.info(f"--- Fin des traitements Import and Generate pour l'année {annee} ")
    logging.info("--------------------------------------------------------------------------")
    
 

def parse_args():
    parser = argparse.ArgumentParser(description="IFP Pipelines")
    parser.add_argument("--annee", type=int, help="Année à traiter (défaut : année courante)")
    parser.add_argument("--pipeline", type=str, default="clean_all", help="Pipeline à exécuter : extract, import, test_all, clean_all")
    parser.add_argument("--telechargement", choices=["y", "n"], default="y", help="Téléchargement et chargement de tous les fichiers sources, référentiels et territoire inclus (défaut : y)")
    parser.add_argument("--load_referentiels", choices=["y", "n"], default="y", help="Téléchargement des fichiers référentiels (défaut : y)")
    parser.add_argument("--load_territoire", choices=["y", "n"], default="y", help="Téléchargement des fichiers territoire (défaut : y)")
    parser.add_argument("--load_sources", choices=["y", "n"], default="y", help="Téléchargement des fichiers sources (défaut : y)")
    parser.add_argument("--load_oxfam", choices=["y", "n"], default="y", help="Téléchargement des fichiers modifiés par Oxfam (défaut : y)")
    parser.add_argument("--db_schema", type=str, default="dev", help="Schema db des vues finales (défaut : dev)")
    return parser.parse_args()



# -------------------------
# ORCHESTRATEUR
# -------------------------
def main():
    args = parse_args()
    annee = args.annee or datetime.now().year
    pipeline = args.pipeline.lower()
    db_schema = args.db_schema
    # Conversion Y/n → bool
    telechargement = args.telechargement == "y"
    load_referentiels = args.load_referentiels == "y"
    load_territoire = args.load_territoire == "y"
    load_sources = args.load_sources == "y"
    load_oxfam = args.load_oxfam == "y"

    logging.info(f"--- Début traitements année {annee} - pipeline {pipeline}---")

    if pipeline == "extract":
        pipeline_extract_and_export(annee, telechargement, load_referentiels, load_territoire, load_sources)

    elif pipeline == "import":
        pipeline_import_and_generate(annee, db_schema, load_oxfam)
    
    elif pipeline == "test_all":
        pipeline_extract_and_export(annee, telechargement, load_referentiels, load_territoire, load_sources)
        pipeline_import_and_generate(annee, db_schema, load_oxfam)
    
    elif pipeline == "clean_all":
        load_env_file(ENV_FILEPATH) 
        # "extract"
        clean_db_tables_and_views(annee, "extract", "sources")
        empty_folder(DATA_ADMIN_DIR, annee, None)
        empty_folder(DATA_MAIRIES_DIR, annee, None)
        empty_folder(DATA_REF_DIR, annee, "csv")
        empty_folder(DATA_TERRITOIRE_DIR, annee, "csv")
        empty_folder(DATA_EXPORTS_DIR, annee, None, True)
        empty_folder(DBT_SEEDS_SOURCES_DIR, annee, "csv", True)
        empty_folder(DBT_SEEDS_REF_DIR, annee, "csv")
        #empty_folder(DBT_SEEDS_TERRITOIRE_DIR, annee, "csv")
        
        # "import"
        clean_db_tables_and_views(annee, "import", "sources")
        empty_folder(DBT_SEEDS_OXFAM_DIR, annee,"csv")
        empty_folder(DATA_OXFAM_DIR, annee,"csv")
        empty_folder(DATA_JSON_DIR, None, "json")


    else:
        logging.error(f"Pipeline inconnu : {pipeline}")
        logging.info("Utilisation : --pipeline extract | import | all")

# -------------------------
# POINT D’ENTRÉE
# -------------------------
if __name__ == "__main__":
    main()