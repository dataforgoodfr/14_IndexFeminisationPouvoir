-- stg_figure6b.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    'figure2d' as figure,
	'parlement' as institution_type,
	'Pouvoir parlementaire' as pouvoir_type,
    {{ year }} AS annee_partition,
    {{ dbt_utils.generate_surrogate_key(['personne_nom', 'personne_prenom']) }} AS personne_id,
    -- md5(personne_raw_text || zone_geographique_libelle) AS personne_id,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre,
    groupe_politique_libelle,
    poste_libelle,
    -- circonscription code is in zone_geographique_libelle field
	SPLIT_PART(zone_geographique_libelle, ' - ', 3) as circonscription_code,
    -- departement code and name is in zone_geographique_libelle field
	REGEXP_REPLACE(SPLIT_PART(zone_geographique_libelle, ' - ', 2), '.*\(([0-9]+)\).*', '\1') as departement_code,
	REGEXP_REPLACE(SPLIT_PART(zone_geographique_libelle, ' - ', 2), ' \([0-9]+\)', '') as departement_libelle,
    -- Region name is in zone_geographique_libelle field
	SPLIT_PART(zone_geographique_libelle, ' - ', 1) as region_libelle
FROM
    {{ ref('figure2d_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}