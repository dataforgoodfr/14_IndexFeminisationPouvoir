-- stg_figure7a.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}


{% for year in range(start_year, current_year + 1) %}
SELECT
    'figure7a' as figure,
	'region' as institution_type,
	'Pouvoir local' as pouvoir_type,
    {{ year }} as annee_partition,
    -- {{ dbt_utils.generate_surrogate_key(["Nom de l'élu", "Prénom de l'élu"]) }} AS personne_id,
    CAST("__id" AS TEXT) AS personne_id,
    CAST("Code de la région" AS TEXT) AS region_code,
    "Libellé de la région" AS region_libelle,
    CAST("Code de la section départementale" AS TEXT) AS departement_code,
    "Libellé de la section départementale" AS departement_libelle,
    "Nom de l'élu" AS personne_nom,
    "Prénom de l'élu" AS personne_prenom,
    "Code sexe" AS personne_genre,
    "Date de naissance" AS date_naissance,
    CAST("Code de la catégorie socio-professionnelle" AS TEXT) AS csp_code,
    "Libellé de la catégorie socio-professionnelle" AS csp_libelle,
    "Date de début du mandat" AS date_debut_mandat,
    "Libellé de la fonction" AS poste_libelle,
    "Date de début de la fonction" AS date_debut_fonction,
    source_url
FROM
    {{ ref('figure7a_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}
