# dbt_run.py
import subprocess
import os
import logging
import json
from pathlib import Path
# ---------------------------------------------------------
# CONFIG LOGGING
# ---------------------------------------------------------
logger = logging.getLogger(__name__)

figures_files = [
    "gouvernement",
    "gouv_postes_régaliens",
    "cabinet_président",
    "cabinet_premier_ministre",
    "dir_cab_ministères",
    "hautes_juridictions",
    "préfectures",
    "ambassades",
    "agences_hautes_autorités",
]

def init_seeds_oxfam (annee: int, seeds_oxfam_dir: Path):
    init_seeds(figures_files, annee, "oxfam", seeds_oxfam_dir)
    
def init_seeds(prefixes: list[str], annee: int, suffixe: str, seeds_dir: str , header="id"):
    """
    Crée les fichiers seeds oxfam placeholders pour une année donnée pour ne pas faire planter dbt
    """
    seeds_dir.mkdir(parents=True, exist_ok=True)

    created_files = []

    for prefix in figures_files:
        filename = f"{prefix}_{suffixe}_{annee}.csv"
        fp = seeds_dir / filename

        try:
            # Création si absent ou vide
            if not fp.exists() or fp.stat().st_size == 0:
                fp.write_text(header + "\n", encoding="utf-8")
                created_files.append(fp)
                logging.info(f"✔ Fichier créé : {fp}")
            else:
                logging.info(f"⏩ Fichier déjà présent : {fp}")

        except Exception as e:
            logging.error(f"❌ Erreur lors de la création du fichier {fp} : {e}")

    logger.info(f"Fin de l'initialisation des seeds oxfam pour {annee}")
    return created_files

def run_dbt_command(cmd: list, project_dir: str):
    logger.info(f"\n➡️  Exécution : {' '.join(cmd)}\n")

    result = subprocess.run(
        cmd + ["--project-dir", project_dir],
        capture_output=True,
        text=True,
        env=os.environ
    )
    logger.info(f"STDOUT:\n{result.stdout}")
    logger.info(f"STDERR:\n{result.stderr}")

    if result.returncode != 0:
        raise Exception(f"❌ dbt command failed: {' '.join(cmd)}")

    logger.info(f"✅ Succès : {' '.join(cmd)}\n")

    


def run_dbt_command_parameters(project_dir: str, dbt_cmd: str, model: str, vars: str):
    run_dbt_command(
        [
            "dbt", dbt_cmd,
            "--select", model,
            "--vars", vars
        ],
        project_dir
    )

def dbt_run_sources_and_exports(project_dir: str, annee: int):
    """
    Exécute le 1er pipeline dbt  :
    - seeds référentiels
    - seeds sources
    - run exports avec variables
    """
    logging.info(f"🚀 Lancement du pipeline dbt initial pour l'année {annee} - 📁 Dossier projet dbt : {project_dir}")

    # 1) Seeds référentiels
    run_dbt_command(
        ["dbt", "seed", "--select", "path:seeds/référentiels"],
        project_dir
    )

    # 2) Seeds sources
    run_dbt_command(
        ["dbt", "seed", "--select", "path:seeds/sources"],
        project_dir
    )

    # 3) Run exports avec variables
    run_dbt_command(
        [
            "dbt", "run",
            "--select", "path:models/exports",
            "--vars", f"{{schema_source: 'sources', annee: {annee}}}"
        ],
        project_dir
    )
    logging.info(f"🎉 Pipeline dbt terminé avec succès !")


def dbt_compile_model(project_dir: str, annee: int, model: str, vars: str):
    """
    Compile uniquement un modèle dbt, avec une chaîne '--vars ...' passée telle quelle.
    Exemple : vars_str="--vars {schema_source: 'sources', ....}"
    """
    project_dir = Path(project_dir)
    logging.info(f"[dbt] Compilation du modèle : {model}")

    # Commande de base
    print(model)
    print(vars)
    cmd = ["dbt", "compile", "--select", model, vars]

    logging.info(f"[dbt] Commande exécutée : {' '.join(cmd)}")

    try:
        subprocess.check_call(cmd, cwd=project_dir)
        logging.info("[dbt] Compilation réussie")
    except subprocess.CalledProcessError as e:
        logging.error(f"[dbt] Erreur lors de dbt compile : {e}")
        raise


def dbt_run_oxfam_validated_data(project_dir: str, annee: int):
    """
    Exécute le 2ème pipeline dbt :
    - seeds oxfam
    - run intermediate and mart
    """
    logging.info(f"🚀 Lancement du pipeline dbt d'intégration des données validées pour l'année {annee} - 📁 Dossier projet dbt : {project_dir}")
    print(f"🚀 Lancement du pipeline dbt pour l'année {annee}")
    print(f"📁 Dossier projet dbt : {project_dir}")

    # 1) Seeds référentiels
    run_dbt_command( ["dbt", "seed", "--select", "path:seeds/oxfam"], project_dir)

    # 2) Run adm stg models
    run_dbt_command_parameters(project_dir, "run", "stg_figure1a_v2", "{schema_source: 'sources', figure: 'gouvernement', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure1b_v2", "{schema_source: 'sources', figure: 'gouv_postes_régaliens', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure1c_v2", "{schema_source: 'sources', figure: 'cabinet_président', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure1d_v2", "{schema_source: 'sources', figure: 'cabinet_premier_ministre', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure1e_v2", "{schema_source: 'sources', figure: 'dir_cab_ministères', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure8_v2", "{schema_source: 'sources', figure: 'hautes_juridictions', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure9_v2", "{schema_source: 'sources', figure: 'préfectures', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure10_v2", "{schema_source: 'sources', figure: 'ambassades', suffixe: 'oxfam'}")
    run_dbt_command_parameters(project_dir, "run", "stg_figure11_v2", "{schema_source: 'sources', figure: 'agences_hautes_autorités', suffixe: 'oxfam'}")
       
    # 3) Run intermediate and mart
    run_dbt_command( ["dbt", "run", "--select", "int_concat_figures_v2_2026"], project_dir)
    run_dbt_command( ["dbt", "run", "--select", "calculated_figures_v2_2026"], project_dir)
    run_dbt_command( ["dbt", "run", "--select", "int_executif_oxfam"], project_dir)
    run_dbt_command( ["dbt", "run", "--select", "calc_executif_oxfam_2026"], project_dir)
    
    logging.info(f"🎉 Pipeline dbt terminé avec succès !")


def dbt_compile_model(project_dir: str, annee: int, model: str, vars: str):
    """
    Compile uniquement un modèle dbt, avec une chaîne '--vars ...' passée telle quelle.
    Exemple : vars_str="--vars {schema_source: 'sources', ....}"
    """
    project_dir = Path(project_dir)
    logging.info(f"[dbt] Compilation du modèle : {model}")

    # Commande de base
    print(model)
    print(vars)
    cmd = ["dbt", "compile", "--select", model, vars]

    logging.info(f"[dbt] Commande exécutée : {' '.join(cmd)}")

    try:
        subprocess.check_call(cmd, cwd=project_dir)
        logging.info("[dbt] Compilation réussie")
    except subprocess.CalledProcessError as e:
        logging.error(f"[dbt] Erreur lors de dbt compile : {e}")
        raise




def get_dbt_used_schema(project_dir: str, annee: int, model: str) -> str:
    """
    Lit target/manifest.json et renvoie le schéma final utilisé par dbt
    pour le modèle donné.
    """
    # Ajout de la chaîne vars si fournie
    if model == "exports":
        model_sample = "gouvernement"
        run_dbt_command(["dbt", "compile", "--select", model_sample, 
                          "--vars", f"{{schema_source: 'sources', annee: {annee}}}"],
                        project_dir)
    
     #lance dbt compile
    #dbt_compile_model(project_dir, annee, model_sample, vars_str)

    project_dir = Path(project_dir)
    manifest_path = project_dir / "target" / "manifest.json"

    logging.info(f"[dbt] Lecture du manifest.json : {manifest_path}")

    if not manifest_path.exists():
        logging.error(f"[dbt] manifest.json introuvable : {manifest_path}")
        raise FileNotFoundError(f"manifest.json introuvable : {manifest_path}")

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as e:
        logging.error(f"[dbt] Erreur de parsing JSON : {e}")
        raise

    node_key = f"model.dbt_ifp.{model_sample}"
    logging.info(f"[dbt] Recherche du modèle dans le manifest : {node_key}")

    if node_key not in manifest["nodes"]:
        logging.error(f"[dbt] Modèle '{model_sample}' introuvable dans manifest.json")
        raise KeyError(f"Modèle '{model_sample}' introuvable dans manifest.json")

    node = manifest["nodes"][node_key]
    schema = node.get("schema")

    logging.info(f"[dbt] Schéma final pour '{model_sample}' : {schema}")

    return schema

def get_dbt_models_from_tags (project_dir: str, tag: str)-> list:   
    # LECTURE DU MANIFEST DBT
    project_dir = Path(project_dir)
    dbt_manifest_path = project_dir / "target/manifest.json"
    with open(dbt_manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    nodes = manifest["nodes"]

    # EXTRACTION DES MODÈLES TAGGÉS 
    tag_nodes = []

    for node_id, node in nodes.items():
        if node["resource_type"] == "model":
            if tag in node.get("tags", []):
                tag_nodes.append({
                    "name": node["name"],
                    "schema": node["schema"],
                    "alias": node.get("alias", node["name"])
                })

    print("Modèles détectés pour export :")
    for m in tag_nodes:
        print(f"- {m['schema']}.{m['alias']}")
    
    return tag_nodes


# def get_dbt_used_schema(project_dir: str, model: str):
#     out = subprocess.check_output(
#         ["dbt", "ls", "--select", model, "--output", "json"],
#         cwd=project_dir
#     ).decode("utf-8", errors="ignore")

#     # On garde uniquement les lignes JSON
#     json_lines = [line for line in out.splitlines() if line.strip().startswith("{")]

#     if not json_lines:
#         raise ValueError("Aucun JSON trouvé dans la sortie dbt")
    
#     print (json_lines[0])

#     # dbt ls peut renvoyer plusieurs modèles → on prend le premier
#     dbt_model = json.loads(json_lines[0])

#     schema = dbt_model["schema"]
#     print(schema)  # dev_exports

# from pathlib import Path
# # Dossier du fichier courant : .../ifp_sources
# CURRENT_DIR = Path(__file__).resolve().parent

# # Racine du projet : remonter d'un cran
# BASE_DIR = CURRENT_DIR.parent

# # Chemins
# DBT_DIR = BASE_DIR / "dbt_ifp"

# print("DBT_DIR =", DBT_DIR)
# #print("Contenu du dossier :", list(DBT_DIR.iterdir()))

# get_dbt_used_schema(DBT_DIR, "path:models/exports")
