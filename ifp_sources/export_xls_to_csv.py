import os
import csv
import shutil
import logging
import pandas as pd
from pathlib import Path

logger = logging.getLogger(__name__)

def excel_to_csv_all_sheets(
    année: int,    
    excel_filepath: str,
    output_dir: str,
    second_output_dir: str = None,
    suffix: str = None,
    exclude_sheet: str = "Home"
):
    try:
        # --- Préparation du suffix ---
        suffix = f"_{suffix}_{année}" if suffix else f"_{année}"
            
        excel_path = Path(excel_filepath)
        logging.info(f"------------- excel_to_csv_all_sheets {excel_filepath}")
        out_dir = Path(output_dir)

        # --- Vérifications des chemins ---
        if not excel_path.exists():
            logger.error(f"❌ Fichier Excel introuvable : {excel_path}")
            return False

        if not out_dir.exists():
            logger.error(f"❌ Dossier output_dir introuvable : {out_dir}")
            return False

        if second_output_dir:
            second_out_dir = Path(second_output_dir)
            if not second_out_dir.exists():
                logger.error(f"❌ Dossier second_output_dir introuvable : {second_out_dir}")
                return False
        else:
            second_out_dir = None

        logger.info(f"📘 Chargement du fichier Excel : {excel_path}")

        # --- Charger toutes les feuilles ---
        try:
            xls = pd.ExcelFile(excel_path)
        except Exception as e:
            logger.error(f"❌ Impossible de lire le fichier Excel : {e}")
            return False

        # --- Boucle sur les feuilles ---
        for sheet in xls.sheet_names:
            if sheet == exclude_sheet:
                logger.info(f"⏭ Feuille ignorée : {sheet}")
                continue

            logger.info(f"📄 Traitement de la feuille : {sheet}")

            try:
                df = pd.read_excel(excel_path, sheet_name=sheet, dtype=str)
            except Exception as e:
                logger.error(f"❌ Erreur lecture feuille '{sheet}' : {e}")
                continue

            df = df.fillna("").astype(str)

            # --- Construction du chemin CSV ---
            csv_filename = f"{sheet}{suffix}.csv"
            csv_path = out_dir / csv_filename

            # --- Export CSV ---
            try:
                df.to_csv(
                    csv_path,
                    index=False,
                    sep=",",
                    quoting=csv.QUOTE_ALL,
                    encoding="utf-8"
                )
                logger.info(f"💾 Export CSV : {csv_path}")
            except Exception as e:
                logger.error(f"❌ Erreur export CSV '{csv_path}' : {e}")
                continue

            # --- Copie vers second_output_dir ---
            if second_out_dir:
                try:
                    csv_copy_path = second_out_dir / csv_filename
                    shutil.copyfile(csv_path, csv_copy_path)
                    logger.info(f"📤 Copie vers second_output_dir : {csv_copy_path}")
                except Exception as e:
                    logger.error(f"❌ Erreur copie vers second_output_dir : {e}")

        logger.info("🎉 Conversion Excel → CSV terminée")
        return True

    except Exception as e:
        logger.error(f"❌ Erreur inattendue dans excel_to_csv_all_sheets : {e}")
        return False
