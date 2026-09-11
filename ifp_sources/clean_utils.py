from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
import logging
from db_connexion import build_conn_str_from_env
from pathlib import Path
from typing import Callable, Iterable

# ---------------------------------------------------------
# CONFIG LOGGING
# ---------------------------------------------------------
logging = logging.getLogger(__name__)


def drop_view(engine: Engine, view_name: str, schema: str | None = None):
    full_name = f"{schema}.{view_name}" if schema else view_name
    sql = text(f"DROP VIEW IF EXISTS {full_name}")

    logging.info(f"Début suppression de la vue : {full_name}")
    logging.debug(f"SQL exécuté : {sql}")

    try:
        with engine.begin() as conn:
            conn.execute(sql)

        logging.info(f"Fin suppression de la vue : {full_name}")

    except Exception as e:
        logging.error(f"Échec suppression de la vue {full_name} : {e}")
        raise


def drop_table(
    engine: Engine,
    table_name: str,
    schema: str | None = None,
    annee: int | None = None,
    suffix: str | None = None,
):
    schema_table_name = f"{schema}.{table_name}" if schema else table_name
    schema_table_suffix_name = (
        f"{schema_table_name}_{suffix}" if suffix else schema_table_name
    )
    full_name = (
        f"{schema_table_suffix_name}_{annee}" if annee else schema_table_suffix_name
    )
    sql = text(f"DROP TABLE IF EXISTS {full_name} CASCADE")

    logging.info(f"Début suppression de la table : {full_name}")
    logging.debug(f"SQL exécuté : {sql}")

    try:
        with engine.begin() as conn:
            conn.execute(sql)

        logging.info(f"Fin suppression de la table : {full_name}")

    except Exception as e:
        logging.error(f"Échec suppression de la table {full_name} : {e}")
        raise


def clean_db_tables_and_views(annee: int, pipeline: str, schema: str | None = None):
    logging.info(f"Debut clean_db_tables_and_views : {pipeline} - {schema} - {annee}")

    conn_str = build_conn_str_from_env()
    engine = create_engine(conn_str)
    if pipeline == "extract":
        # TODO
        drop_table(engine, "administration", schema, annee)
        drop_table(engine, "administration_hierarchies", schema, annee)
        drop_table(engine, "mairies", schema, annee)
        drop_table(engine, "mairies_plm_arr", schema, annee)
        drop_table(engine, "ref_hautes_juridictions", schema, annee)
        drop_table(engine, "ref_agences_hautes_autorites", schema, annee)
        drop_table(engine, "ref_postes_regaliens", schema, annee)
        drop_table(engine, "ref_figures", schema, annee)

    elif pipeline == "import":
        print("------------------------ IMPORT CLEAN-------------------")
        drop_table(engine, "gouvernement", schema, annee, "oxfam")
        drop_table(engine, "gouv_postes_regaliens", schema, annee, "oxfam")
        drop_table(engine, "cabinet_president", schema, annee, "oxfam")
        drop_table(engine, "cabinet_premier_ministre", schema, annee, "oxfam")
        drop_table(engine, "dir_cab_ministeres", schema, annee, "oxfam")
        drop_table(engine, "hautes_juridictions", schema, annee, "oxfam")
        drop_table(engine, "prefectures", schema, annee, "oxfam")
        drop_table(engine, "ambassades", schema, annee, "oxfam")
        drop_table(engine, "agences_hautes_autorites", schema, annee, "oxfam")

    # elif pipeline == "all":
    #     pipeline_import_and_generate(annee)

    engine.dispose()
    logging.info(f"Fin clean_db_tables_and_views : {pipeline} - {schema} - {annee}")


def delete_file_type(
    glob_fn: Callable[[str], Iterable[Path]],
    filetype: str = "csv",
    annee: int | None = None,
):
    pattern = f"*_{annee}.{filetype}" if annee else f"*.{filetype}"
    logging.info(f"Suppression files {filetype} - pattern {pattern}")
    for f in glob_fn(pattern):
        logging.info(f"Suppression {filetype} : {f.name}")
        f.unlink()


def empty_folder(
    dir: str | Path,
    annee: int | None = None,
    filetype: str | None = None,
    recursive: bool = False,
):
    folder = Path(dir)

    if not folder.exists():
        logging.warning(f"Dossier inexistant : {folder}")
        return

    logging.info(f"--- Nettoyage du dossier : {folder} ---")
    logging.info(
        f"Paramètres : annee={annee}, filetype={filetype}, recursive={recursive}"
    )

    # Choix entre glob (non récursif) et rglob (récursif)
    glob_fn = folder.rglob if recursive else folder.glob

    if filetype is not None:
        delete_file_type(glob_fn, filetype, annee)
    else:
        # A voir + tard si on passe "*", peut-être trop drastique ? bien tester avant ....
        delete_file_type(glob_fn, "csv", annee)
        delete_file_type(glob_fn, "xl*", annee)
        delete_file_type(glob_fn, "parquet", annee)
        delete_file_type(glob_fn, "json", annee)
    logging.info(f"--- Fin nettoyage du dossier : {folder} ---")
    return
