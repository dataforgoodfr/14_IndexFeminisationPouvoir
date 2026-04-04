{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}

select
    {{ year }} as annee_partition,
    md5(__id::text || {{ year }}::text) as id,
    "Code du département" as code_departement,
    "Libellé du département" as nom_departement,
    "Code du canton" as code_canton,
    "Libellé du canton" as nom_canton,
    "Nom de l'élu" as nom_elu,
    "Prénom de l'élu" as prenom_elu,
    "Code sexe" as genre,
    "Date de naissance" as date_naissance,
    "Code de la catégorie socio-professionnelle" as code_categorie_socprof,
    "Libellé de la catégorie socio-professionnelle" as nom_categorie_socprof,
    "Date de début du mandat" as date_debut_mandat,
    "Libellé de la fonction" as nom_fonction,
    "Date de début de la fonction" as date_debut_fonction

from {{ ref('figure6a_' ~ year) }}
{% if not loop.last %} union all {% endif %}
{% endfor %}