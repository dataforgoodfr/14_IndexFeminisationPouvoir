from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
import os
import logging
from db_connexion import build_conn_str_from_env
from pathlib import Path

# ---------------------------------------------------------
# CONFIG LOGGING
# ---------------------------------------------------------
logger = logging.getLogger(__name__)

def drop_view(engine: Engine, view_name: str, schema: str | None = None):
    full_name = f"{schema}.{view_name}" if schema else view_name
    sql = text(f"DROP VIEW IF EXISTS {full_name}")

    logger.info(f"Début suppression de la vue : {full_name}")
    logger.debug(f"SQL exécuté : {sql}")

    try:
        with engine.begin() as conn:
            conn.execute(sql)

        logger.info(f"Fin suppression de la vue : {full_name}")

    except Exception as e:
        logger.error(f"Échec suppression de la vue {full_name} : {e}")
        raise


def drop_table(engine: Engine, table_name: str, schema: str | None = None, annee: int | None = None, suffix: str | None = None):
    schema_table_name = f"{schema}.{table_name}" if schema else table_name
    schema_table_suffix_name = f"{schema_table_name}_{suffix}" if suffix else schema_table_name
    full_name = f"{schema_table_suffix_name}_{annee}" if annee else schema_table_suffix_name
    sql = text(f"DROP TABLE IF EXISTS {full_name} CASCADE")

    logger.info(f"Début suppression de la table : {full_name}")
    logger.debug(f"SQL exécuté : {sql}")

    try:
        with engine.begin() as conn:
            conn.execute(sql)

        logger.info(f"Fin suppression de la table : {full_name}")

    except Exception as e:
        logger.error(f"Échec suppression de la table {full_name} : {e}")
        raise


def clean_db_tables_and_views(annee: int, pipeline: str, schema: str| None = None):
    logging.info(f"Debut clean_db_tables_and_views : {pipeline} - {schema} - {annee}")

    conn_str = build_conn_str_from_env()
    engine = create_engine(conn_str)
    if pipeline == "extract":
        drop_table(engine, "administration", schema, annee)
        drop_table(engine, "administration_hierarchies", schema, annee)
        drop_table(engine, "ref_hautes_juridictions", schema, annee)
        drop_table(engine, "ref_agences_hautes_autorités", schema, annee)
        drop_table(engine, "ref_postes_régaliens", schema, annee)
        drop_table(engine, "ref_figures", schema, annee)

    elif pipeline == "import":
        print ("------------------------ IMPORT CLEAN-------------------")
        drop_table(engine, "gouvernement", schema, annee, "oxfam")
        drop_table(engine, "gouv_postes_régaliens" , schema, annee, "oxfam")
        drop_table(engine, "cabinet_président" , schema, annee, "oxfam")
        drop_table(engine, "cabinet_premier_ministre" , schema, annee, "oxfam")
        drop_table(engine, "dir_cab_ministères" , schema, annee, "oxfam")
        drop_table(engine, "hautes_juridictions" , schema, annee, "oxfam")
        drop_table(engine, "préfectures" , schema, annee, "oxfam")
        drop_table(engine, "ambassades" , schema, annee, "oxfam")
        drop_table(engine, "agences_hautes_autorités" , schema, annee, "oxfam")

    # elif pipeline == "all":
    #     pipeline_import_and_generate(annee) 

    engine.dispose()
    logging.info(f"Fin clean_db_tables_and_views : {pipeline} - {schema} - {annee}")


def empty_folder(dir: str | Path, annee: int | None = None, keep_xl: bool = True, recursive: bool = False):
    folder = Path(dir)

    if not folder.exists():
        logger.warning(f"Dossier inexistant : {folder}")
        return

    logger.info(f"Nettoyage du dossier : {folder}")
    logger.info(f"Paramètres : annee={annee}, keep_xl={keep_xl}, recursive={recursive}")

    # Choix entre glob (non récursif) et rglob (récursif)
    glob_fn = folder.rglob if recursive else folder.glob

    # CSV
    pattern_csv = f"*_{annee}.csv" if annee else "*.csv"
    for f in glob_fn(pattern_csv):
        logger.info(f"Suppression CSV : {f.name}")
        f.unlink()
    # XL
    if not keep_xl:
        pattern_xl = f"*_{annee}.xl*" if annee else "*.xl*"
        for f in glob_fn(pattern_xl):
            logger.info(f"Suppression XL : {f.name}")
            f.unlink()
    logger.info(f"Fin nettoyage du dossier : {folder}")
    return


    


    