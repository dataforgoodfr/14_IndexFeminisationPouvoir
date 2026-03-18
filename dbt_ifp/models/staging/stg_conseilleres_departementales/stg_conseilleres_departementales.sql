with conseilleres_departementales as (
    select * from {{ ref('figure6a') }}
),

renamed as (
    select
        __id as id,
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
        "Date de début de la fonction" as date_debut_fonction,
        source_scraper

    from conseilleres_departementales
)

select *
from renamed
