{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}


{% for year in range(start_year, current_year + 1) %}
select
    'figure4' as figure,
	'parlement_europeen' as institution_type,
	'Pouvoir local' as pouvoir_type,
    {{ year }} as annee_partition,
    -- {{ dbt_utils.generate_surrogate_key(["Nom de l'élu", "Prénom de l'élu"]) }} AS personne_id,
    __id as personne_id,
    "Nom de l'élu" as personne_nom,
    "Prénom de l'élu" as personne_prenom,
    "Code sexe" as personne_genre,
    "Date de naissance" as date_naissance,
    Cast("Code de la catégorie socio-professionnelle" as TEXT) as csp_code,
    "Libellé de la catégorie socio-professionnelle" as csp_libelle,
    "Date de début du mandat" as date_debut_mandat,
    source_url
from
    {{ ref('figure4_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}
