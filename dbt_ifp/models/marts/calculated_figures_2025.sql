SELECT
    type_pouvoir as pouvoir_type,
    indicateur as indicateur,
    institution_type as institution_type,
    nom_figure as figure_nom,
    CAST(REPLACE(REPLACE(reference_rapport_2025::TEXT, ',', '.'), '%', '') AS FLOAT) as pct_femmes,
    nb_personnes_attendu as nb_personnes_attendues
FROM {{ ref('figures_2025') }}