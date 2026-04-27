{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}

select
    'figure2c' as figure,
	'parlement' as institution_type,
	'Pouvoir parlementaire' as pouvoir_type,
    {{ year }} as annee_partition,
    {{ dbt_utils.generate_surrogate_key(['personne_nom', 'personne_prenom']) }} AS personne_id,
    -- md5(personne_prenom || personne_nom || zone_geographique_libelle || {{ year }}::text) as personne_id,
    personne_prenom,
    personne_nom,
    personne_genre,
    groupe_politique_libelle,
    poste_libelle,
    SPLIT_PART(zone_geographique_libelle, ' (', 1) as departement_libelle,
    source_url

from {{ ref('figure2c_' ~ year) }}
{% if not loop.last %} union all {% endif %}
{% endfor %}

