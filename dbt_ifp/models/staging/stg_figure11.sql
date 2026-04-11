-- Figure 11 -- Liste des hommes et des femmes présidant une haute autorité ou agence française

{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    DISTINCT
    {{ year }} AS annee_partition,
    md5(concat(personne_raw_text, zone_geographique_libelle)) AS id,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre AS genre,
    -- groupe_politique_libelle, -- champ toujours nul
    poste_libelle,
    zone_geographique_libelle,
    zone_geographique_type,
    source_url
FROM
    {{ ref('figure11_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}