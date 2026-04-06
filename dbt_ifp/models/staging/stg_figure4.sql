{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}


{% for year in range(start_year, current_year + 1) %}
select
    {{ year }} as annee_partition,
    __id as id,
    "Nom de l'élu" as nom_elu,
    "Prénom de l'élu" as prenom_elu,
    "Code sexe" as genre,
    "Date de naissance" as date_naissance,
    "Code de la catégorie socio-professionnelle" as code_csp,
    "Libellé de la catégorie socio-professionnelle" as libelle_csp,
    "Date de début du mandat" as date_debut_mandat,
    source_url
from
    {{ ref('figure4_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}
