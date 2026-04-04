{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}

select
    {{ year }} as annee_partition,
    md5(personne_prenom || personne_nom || zone_geographique_libelle || {{ year }}::text) as id,
    personne_prenom as prenom_elu,
    personne_nom as nom_elu,
    personne_genre as genre,
    groupe_politique_libelle,
    poste_libelle,
    zone_geographique_libelle,
    zone_geographique_type

from {{ ref('figure2c_' ~ year) }}
{% if not loop.last %} union all {% endif %}
{% endfor %}

