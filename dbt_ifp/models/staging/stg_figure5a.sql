-- stg_figure5a.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    {{ year }} AS year_partition,
    id,
    code_departement,
    libelle_departement,
    code_commune,
    libelle_commune,
    nom_elu,
    prenom_elu,
    genre_elu,
    date_debut_mandat
FROM
    {{ ref('figure5a_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}
