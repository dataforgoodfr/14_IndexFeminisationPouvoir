"""Script permettant de générer un fichier Excel pour Oxfam à partir des figures générées par les scrapers"""

from pathlib import Path
import pandas as pd
import logging
import re

SEEDS_PATH = Path("dbt_ifp/seeds")
FIGURE_REF_PATH = Path("dbt_ifp/excel_reports/reference_figures.csv")
OUTPUT_EXCEL_PATH = Path("dbt_ifp/excel_reports/rapport_figures.xlsx")
LOGGER = logging.getLogger(__name__)

FILENAME_REGEX = r"^figure.+_\d{4}\.csv$"


def get_seeds_dict() -> dict:
    """
    Read all the files from the seeds folder and return a dictionary with the seed name as keys and the associated
    dataframes as values
    """

    seeds_dict = {}

    for filename in SEEDS_PATH.iterdir():
        if "figure" in filename.name:
            if re.match(FILENAME_REGEX, filename.name):
                seed_df = pd.read_csv(filename)
                curated_name = filename.name.split("_")[0]
                seeds_dict[curated_name] = seed_df
            else:
                LOGGER.info(
                    f"Ignoring file {filename.name} as it does not match expected format."
                )

    return seeds_dict


def get_seeds_stats(seeds_dict: dict) -> pd.DataFrame:
    """
    Generate a DataFrame indicating the number of found rows for each figure
    """

    name_list = seeds_dict.keys()
    nb_values_list = [len(seed_df) for seed_df in seeds_dict.values()]

    nb_values_df = pd.DataFrame(
        data={
            "curated_name": name_list,
            "nb_personnes_trouvees": nb_values_list,
        }
    )

    return nb_values_df


def generate_recap_df(seeds_dict: dict) -> pd.DataFrame:
    """
    Generate a DataFrame indicating for each figure the expected number of rows (from a stacic DataFrame) and
    the actual number of rows present in the csv files
    """

    ref_df = pd.read_csv(FIGURE_REF_PATH)
    ref_df["curated_name"] = ref_df["nom_figure"].apply(
        lambda x: x.replace(" ", "").lower()
    )

    nb_values_df = get_seeds_stats(seeds_dict)

    merged_df = ref_df.merge(nb_values_df, on="curated_name", how="left")
    merged_df.drop("curated_name", axis=1, inplace=True)

    return merged_df


def generate_excel_report(seeds_dict: dict, stats_df: pd.DataFrame) -> None:
    """
    Generate an Excel file with a sheet for each figure, and a recap sheet indicating the expected and found
    number of rows for each figure
    """

    with pd.ExcelWriter(OUTPUT_EXCEL_PATH) as writer:
        stats_df.to_excel(writer, sheet_name="Liste des figures", index=False)
        for curated_name, seed_df in sorted(seeds_dict.items()):
            seed_df.to_excel(writer, sheet_name=curated_name, index=False)


def main():
    """
    Generate an excel file with:
    - A sheet for every found figure in csv format
    - A recap sheet indicating the expected and found number of rows for each figure
    The input files must be in the dbt_ifp/seeds folder, and follow the naming convention
    "figure{figure_name}_{year}.csv . The reference file for the expected number of rows per figure must be at
    dbt_ifp/excel_reports/reference_figures.csv
    The output excel sheet is generated at dbt_ifp/excel_reports/rapport_figures.xlsx

    To run : uv run dbt_ifp/excel_reports/rapport_figures.py from the project root
    """

    seeds_dict = get_seeds_dict()
    stats_df = generate_recap_df(seeds_dict)
    generate_excel_report(seeds_dict, stats_df)


if __name__ == "__main__":
    main()
