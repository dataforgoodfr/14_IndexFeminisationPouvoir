with deputees as (
    select * from {{ ref('figure2a') }}
),

renamed as (
    select
        __id as id,
        "Code du département" as code_departement,
        "Libellé du département" as nom_departement,
        "Code de la collectivité à statut particulier" as code_collectivite_statut_part,
        "Libellé de la collectivité à statut particulier" as nom_collectivite_statut_part,
        "Code de la circonscription législative" as code_circonscription,
        "Libellé de la circonscription législative" as nom_circonscription,
        "Nom de l'élu" as nom_elu,
        "Prénom de l'élu" as prenom_elu,
        "Code sexe" as genre,
        "Date de naissance" as date_naissance,
        "Code de la catégorie socio-professionnelle" as code_categorie_socprof,
        "Libellé de la catégorie socio-professionnelle" as nom_categorie_socprof,
        "Date de début du mandat" as date_debut_mandat,
        source_scraper

    from deputees
)

select *
from renamed
