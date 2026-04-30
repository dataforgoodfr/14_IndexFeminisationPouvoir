{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    'figure3b' as figure,
	'senat' as institution_type,
	'Pouvoir parlementaire' as pouvoir_type,
    {{ year }} AS annee_partition,
    {{ dbt_utils.generate_surrogate_key(['personne_nom', 'personne_prenom']) }} AS personne_id,
    -- md5(personne_raw_text || personne_genre || poste_libelle) AS personne_id,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre,
    cast(groupe_politique_libelle as varchar) as groupe_politique_libelle,
    poste_libelle,
    source_url
FROM
    {{ ref('figure3b_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}