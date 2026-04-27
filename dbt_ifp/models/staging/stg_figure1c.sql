-- stg_figure1c.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    'figure1c' as figure,
    'Pouvoir exécutif' as pouvoir_type,
    'gouvernement' as institution_type,
    {{ year }} AS annee_partition,
    {{ dbt_utils.generate_surrogate_key(['personne_nom', 'personne_prenom', 'poste_libelle']) }} AS personne_id,
    -- md5(personne_raw_text || poste_libelle) AS personne_id,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre,
    poste_libelle,
    source_url
FROM
    {{ ref('figure1c_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}