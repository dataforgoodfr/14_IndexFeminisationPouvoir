-- Figure 11 -- Liste des hommes et des femmes présidant une haute autorité ou agence française

{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    DISTINCT
    'figure11' as figure,
	'agence' as institution_type,
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
    zone_geographique_libelle as agence_libelle,
    source_url
FROM
    {{ ref('figure11_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}