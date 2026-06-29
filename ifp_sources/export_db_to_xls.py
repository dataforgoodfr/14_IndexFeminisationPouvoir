import pandas as pd
from sqlalchemy import create_engine
from openpyxl import load_workbook
from openpyxl.worksheet.datavalidation import DataValidation
from pathlib import Path
from datetime import datetime
import logging
import traceback
import csv
from db_connexion import build_conn_str_from_env

# ---------------------------------------------------------
# CONFIG LOGGING
# ---------------------------------------------------------
logger = logging.getLogger(__name__)



# ---------------------------------------------------------
# 3) TEST SI LE FICHIER EXCEL EST OUVERT
# ---------------------------------------------------------
def test_excel_not_open(path: Path) -> bool:
    """
    Vérifie que le fichier Excel n'est pas ouvert.
    """
    try:
        test_file = open(path, "a")
        test_file.close()
        logging.info(f"Fichier Excel {path} disponible en écriture.")
        return True
    except PermissionError:
        logging.error(f"❌ Le fichier {path} est ouvert dans Excel.")
        return False


# ---------------------------------------------------------
# 4) EXPORT CSV + EXCEL POUR UNE LISTE DE MODÈLES
# ---------------------------------------------------------
def export_models_to_files(annee: int, models: list, output_xl: str, csv_dir: str) -> bool:
    """
    Exporte les modèles en CSV + Excel.
    models = [{"name": "...", "schema": "...", "alias": "..."}]
    """
    try:
        conn_str = build_conn_str_from_env()
        engine = create_engine(conn_str)

        with pd.ExcelWriter(output_xl, engine="openpyxl") as writer:
            for model in models:
                schema = model["schema"]
                table = model["alias"]
                name = model["name"]

                query = f'SELECT * FROM "{schema}"."{table}"'
                logging.info(f"Export : {schema}.{table}")

                df = pd.read_sql(query, engine)
                df = df.fillna("").astype(str)

                df["modification"] = ""
                df["commentaires"] = ""

                # CSV
                csv_path = csv_dir / f"{name}_{annee}.csv"
                df.to_csv(csv_path, index=False, encoding="utf-8-sig", sep=",", quotechar='"', quoting=csv.QUOTE_MINIMAL)

                # Excel
                df_excel = df.copy()

                def quote_if_number(x):
                    if x is None:
                        return ""
                    s = str(x).strip()
                    if s == "":
                        return s
                    if s.replace(".", "", 1).isdigit():
                        return f'"{s}"'
                    return s

                for col in df_excel.columns:
                    df_excel[col] = df_excel[col].apply(quote_if_number)

                sheet_name = name[:31]
                df_excel.to_excel(writer, sheet_name=sheet_name, index=False)

        logging.info("Export CSV + Excel terminé.")
        return True

    except Exception as e:
        logging.error(f"Erreur lors de l'export : {e}")
        logging.error(traceback.format_exc())
        return False


# ---------------------------------------------------------
# 5) FORCER FORMAT TEXTE DANS EXCEL
# ---------------------------------------------------------
def force_excel_text_format(xl_path: Path):
    try:
        wb = load_workbook(xl_path)

        for sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            for row in ws.iter_rows():
                for cell in row:
                    cell.number_format = "@"

        wb.save(xl_path)
        logging.info("Format texte appliqué à toutes les cellules.")

    except Exception as e:
        logging.error(f"Erreur lors du formatage Excel : {e}")
        logging.error(traceback.format_exc())
        raise


# ---------------------------------------------------------
# 6) AJOUT LISTE DÉROULANTE SUR "modification"
# ---------------------------------------------------------
def add_modification_dropdown(xl_path: Path):
    try:
        wb = load_workbook(xl_path)

        for sheet_name in wb.sheetnames:
            ws = wb[sheet_name]

            mod_col = None
            for col in range(1, ws.max_column + 1):
                if ws.cell(row=1, column=col).value == "modification":
                    mod_col = col
                    break

            if mod_col:
                dv = DataValidation(
                    type="list",
                    formula1='"Supprimé,Modifié,Ajouté"',
                    allow_blank=True
                )

                cell_range = (
                    f"{ws.cell(2, mod_col).coordinate}:"
                    f"{ws.cell(ws.max_row, mod_col).coordinate}"
                )
                dv.add(cell_range)
                ws.add_data_validation(dv)

        wb.save(xl_path)
        logging.info("Liste déroulante ajoutée.")

    except Exception as e:
        logging.error(f"Erreur lors de l'ajout de la liste déroulante : {e}")
        logging.error(traceback.format_exc())
        raise


# ---------------------------------------------------------
# 7) FONCTION PRINCIPALE : FAIT TOUT
# ---------------------------------------------------------
def run_exports(env_file: str, annee: int, models: list, data_export_dir: str, output_name: str) -> bool:
    """
    Pipeline complet :
    - charge env
    - initialise chemins
    - vérifie Excel
    - export CSV + Excel
    - format texte
    - liste déroulante
    """
    try:
        logging.info("=== DÉBUT EXPORTS ===")

        #db_conf = load_env_config(env_file)
        #paths = init_paths(base_export_dir)
        export_dir = Path(data_export_dir)

        output_xl = export_dir / f"{output_name}.xlsx"

        csv_dir = export_dir / output_name
        csv_dir.mkdir(exist_ok=True)


        bOK = test_excel_not_open(output_xl)
        if not bOK:
            return False
        bOK = export_models_to_files(annee, models, output_xl, csv_dir)
        if bOK:
            force_excel_text_format(output_xl)
            add_modification_dropdown(output_xl)
            logging.info("=== EXPORTS TERMINÉS AVEC SUCCÈS ===")
        else:
            logging.info("=== PB EXPORTS ===")
        return bOK
    except Exception as e:
        logging.error("❌ Échec du pipeline d'export.")
        logging.error(traceback.format_exc())
        return False
