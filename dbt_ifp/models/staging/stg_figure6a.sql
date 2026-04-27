{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}

{% for year in range(start_year, current_year + 1) %}

select
    'figure6a' as figure,
	'departement' as institution_type,
	'Pouvoir local' as pouvoir_type,
    {{ year }} as annee_partition,
    -- {{ dbt_utils.generate_surrogate_key(["Nom de l'élu", "Prénom de l'élu"]) }} AS personne_id,
    md5(__id::text || {{ year }}::text) as personne_id,
    "Code du département" as departement_code,
    "Libellé du département" as departement_libelle,
    CAST("Code du canton" as TEXT) as canton_code,
    "Libellé du canton" as canton_libelle,
    "Nom de l'élu" as personne_nom,
    "Prénom de l'élu" as personne_prenom,
    "Code sexe" as personne_genre,
    "Date de naissance" as date_naissance,
    CAST("Code de la catégorie socio-professionnelle" as TEXT) as csp_code,
    "Libellé de la catégorie socio-professionnelle" as csp_libelle,
    "Date de début du mandat" as date_debut_mandat,
    "Libellé de la fonction" as poste_libelle,
    "Date de début de la fonction" as date_debut_fonction,
    source_url

from {{ ref('figure6a_' ~ year) }}
{% if not loop.last %} union all {% endif %}
{% endfor %}