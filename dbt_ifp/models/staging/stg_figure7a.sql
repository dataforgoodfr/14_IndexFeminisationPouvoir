-- stg_figure7a.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}


{% for year in range(start_year, current_year + 1) %}
SELECT
    {{ year }} as annee_partition,
    CAST("__id" AS TEXT) AS id,
    CAST("Code de la région" AS TEXT) AS code_region,
    "Libellé de la région" AS libelle_region,
    CAST("Code de la section départementale" AS TEXT) AS code_dep,
    "Libellé de la section départementale" AS libelle_dep,
    "Nom de l'élu" AS nom_elu,
    "Prénom de l'élu" AS prenom_elu,
    "Code sexe" AS code_sexe,
    "Date de naissance" AS date_naissance,
    CAST("Code de la catégorie socio-professionnelle" AS TEXT) AS code_csp,
    "Libellé de la catégorie socio-professionnelle" AS libelle_csp,
    "Date de début du mandat" AS date_mandat_debut,
    "Libellé de la fonction" AS libelle_fonction,
    "Date de début de la fonction" AS date_fonction_debut,
    source_url
FROM
    {{ ref('figure7a_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}
