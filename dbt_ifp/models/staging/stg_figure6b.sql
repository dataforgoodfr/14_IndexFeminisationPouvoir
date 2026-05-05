-- stg_figure6b.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    DISTINCT
    'figure6b' as figure,
	'departement' as institution_type,
	'Pouvoir local' as pouvoir_type,
    {{ year }} AS annee_partition,
    {{ dbt_utils.generate_surrogate_key(['personne_nom', 'personne_prenom']) }} AS personne_id,
    -- md5(personne_raw_text || zone_geographique_libelle) AS personne_id,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre,
    CAST(groupe_politique_libelle as TEXT) as groupe_politique_libelle,
    poste_libelle,
    zone_geographique_libelle as prefecture_libelle,
    source_url
FROM
    {{ ref('figure6b_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}