import requests
import pandas as pd
import json
import shutil
from pathlib import Path
import csv
import logging
import os
from datetime import datetime

from files_utils import get_zip_files

logger = logging.getLogger(__name__)

#################### Paths and URLs ####################
# TODO - gestion de l'annéee
URL_COG = "https://www.insee.fr/fr/statistiques/fichier/7766585/cog_ensemble_2024_csv.zip"

COG_ZIP_FILENAME = "cog_ensemble_2024_csv.zip"
COG_SUB_DIR = "cog_ensemble_2024"
COG_FILENAMES = ["v_commune_2024.csv", "v_departement_2024.csv"]





#################### Fcts utilitaires ####################
def normalise_code_commune(code: str) -> str:
    if not code:
        return ""
    code = str(code).strip() 
    return "0" + code if len(code) == 4 else code




#################### Main ####################
    
def get_GOG_data(année: int, output_dir: str, seeds_dir: str, telechargement: bool = False, date_elections: datetime | None = None):
    try:
        # --- 1. Vérification des dossiers & telechargement raw data---
        output_path = Path(output_dir)
        seeds_path = Path(seeds_dir)

        bOK = get_zip_files(année, output_path, seeds_path, URL_COG, COG_ZIP_FILENAME, COG_SUB_DIR, COG_FILENAMES, telechargement)
        
        return bOK

    except Exception as e:
        print(f"❌ Erreur dans get_GOG_data  : {e}")
        return False
