import pandas as pd
from sqlalchemy import create_engine
import logging
import json
from pathlib import Path
import os
from db_connexion import build_conn_str_from_env

# ---------------------------------------------------------
# CONFIG LOGGING
# ---------------------------------------------------------
logger = logging.getLogger(__name__)

# ---------------------------------------------------------
# FONCTION PRINCIPALE
# ---------------------------------------------------------
def generate_json_executif(annee: int, view_name_type: str, output_file: str | Path):
    """
    Lit une vue PostgreSQL contenant les données exécutif
    et génère un JSON structuré conforme au format Oxfam.
    """

    logging.info("Initialisation de la génération du JSON exécutif")

    # -----------------------------------------------------
    # Connexion PostgreSQL
    # -----------------------------------------------------
    try:
        conn_str = build_conn_str_from_env()
        engine = create_engine(conn_str)

        logging.info("Connexion PostgreSQL OK")
    except Exception as e:
        logging.error(f"Erreur de connexion PostgreSQL : {e}")
        return None

    # -----------------------------------------------------
    # Lecture de la vue
    # -----------------------------------------------------
    try:
        view_name = f"{view_name_type}_{annee}"
        query = f"SELECT * FROM {view_name}"
        df = pd.read_sql(query, engine)
        logging.info(f"Lecture de la vue {view_name} OK ({len(df)} lignes)")
        logging.info(f"{df}")
    except Exception as e:
        logging.error(f"Erreur lors de la lecture SQL : {e}")
        return None

    # -----------------------------------------------------
    # Filtrer sur le pouvoir exécutif
    # ----------------------------------------------------- 
    try:
        df_exec = df[df["json_tag_level_1"] == "executif"]
        if df_exec.empty:
            logging.warning("Aucune donnée pour le pouvoir exécutif")
            return None
        logging.info(f"{len(df_exec)} lignes pour le pouvoir exécutif")
    except Exception as e:
        logging.error(f"Erreur lors du filtrage exécutif : {e}")
        return None

    # -----------------------------------------------------
    # Construction des composantes
    # -----------------------------------------------------
    try:
        composantes = {
            row["json_tag_level_2"]: {
                "annee": int(row["annee"]),
                "score": float(row["pct_femmes"]),
                "evolution": float(row["evolution"])
            }
            for _, row in df_exec.iterrows()
        }
        logging.info("Construction des composantes OK")
    except Exception as e:
        logging.error(f"Erreur lors de la construction des composantes : {e}")
        return None

    # -----------------------------------------------------
    # Calcul score global et évolution globale
    # -----------------------------------------------------
    try:
        score_global = round(df_exec["pct_femmes"].mean(), 1)
        evolution_global = round(df_exec["evolution"].mean(), 1)
        annee = int(df_exec["annee"].iloc[0])
        logging.info("Calcul des agrégats globaux OK")
    except Exception as e:
        logging.error(f"Erreur lors du calcul des agrégats : {e}")
        return None

    # -----------------------------------------------------
    # Construction du JSON final
    # -----------------------------------------------------
    try:
        json_executif = {
            "executif": {
                "score": score_global,
                "evolution": evolution_global,
                "annee": annee,
                "composantes": composantes
            }
        }
        logging.info("JSON exécutif généré avec succès")
    except Exception as e:
        logging.error(f"Erreur lors de la construction du JSON final : {e}")
        return None

    # -----------------------------------------------------
    # Sauvegarde dans un fichier si demandé
    # -----------------------------------------------------
    if output_file:
        try:
            os.makedirs(os.path.dirname(output_file), exist_ok=True)
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(json_executif, f, indent=2, ensure_ascii=False)
            logging.info(f"JSON sauvegardé dans {output_file}")
        except Exception as e:
            logging.error(f"Erreur lors de la sauvegarde du fichier : {e}")

    return json_executif


# ---------------------------------------------------------
# EXEMPLE D’APPEL
# ---------------------------------------------------------
# if __name__ == "__main__":
#     CONNECTION = "postgresql://user:pwd@host:5432/ifp"

#     result = build_executif_json(CONNECTION)

#     if result:
#         print(json.dumps(result, indent=2, ensure_ascii=False))
