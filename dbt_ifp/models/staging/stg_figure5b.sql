-- stg_figure5b.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    'figure5b' as figure,
	'mairie' as institution_type,
	'Pouvoir local' as pouvoir_type,
    {{ year }} AS annee_partition,
    -- {{ dbt_utils.generate_surrogate_key(["Nom de l'élu", "Prénom de l'élu"]) }} AS personne_id,
    "__id" as personne_id,
    -- departement code and names for overseas territories are in collectivite_statut_part columns
	COALESCE(cast("Code de la collectivité à statut particulier" as TEXT), "Code du département") as departement_code,
	COALESCE("Libellé de la collectivité à statut particulier", "Libellé du département") as departement_libelle,
    "Code de la commune" as commune_code,
    "Libellé de la commune" as commune_libelle,
    "Nom de l'élu" as personne_nom,
    "Prénom de l'élu" as personne_prenom,
    "Code sexe" as personne_genre,
    "Date de naissance" as date_naissance,
    CAST("Code de la catégorie socio-professionnelle" as TEXT) as csp_code,
    "Libellé de la catégorie socio-professionnelle" as csp_libelle,
    "Date de début du mandat" as date_debut_mandat,
    "Date de début de la fonction" as date_debut_fonction,
    source_url
FROM
    {{ ref('figure5b_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}