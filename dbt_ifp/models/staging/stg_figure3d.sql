{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}
SELECT
    {{ year }} AS annee_partition,
    md5(personne_raw_text || personne_genre || poste_libelle) AS id,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre AS genre,
    groupe_politique_libelle,
    poste_libelle
FROM
    {{ ref('figure3d_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}