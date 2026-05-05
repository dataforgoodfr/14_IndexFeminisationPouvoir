-- Figure 10 -- Liste des ambassadrices et ambassadeurs

{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    DISTINCT
    'figure10' as figure,
	'ambassade' as institution_type,
	'Autre Pouvoir' as pouvoir_type,
    {{ year }} AS annee_partition,
    {{ dbt_utils.generate_surrogate_key(['personne_nom', 'personne_prenom', 'poste_libelle', 'zone_geographique_libelle']) }} AS personne_id,
    -- md5(concat(personne_raw_text, zone_geographique_libelle)) AS personne_id,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre,
    groupe_politique_libelle, -- champ toujours nul
    poste_libelle,
    zone_geographique_libelle as pays_libelle,
    source_url
FROM
    {{ ref('figure10_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}