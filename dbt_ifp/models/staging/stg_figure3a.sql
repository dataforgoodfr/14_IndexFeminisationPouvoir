SELECT
    __id as id,
    "Code du département" as code_departement,
    "Libellé du département" as libelle_departement,
    "Code de la collectivité à statut particulier" as code_collectivite_statut_part,
    "Libellé de la collectivité à statut particulier" as nom_collectivite_statut_part,
    "Nom de l'élu" as nom_elu,
    "Prénom de l'élu" as prenom_elu,
    "Code sexe" as genre,
    "Date de naissance" as date_naissance,
    "Code de la catégorie socio-professionnelle" as code_categorie_socprof,
    "Libellé de la catégorie socio-professionnelle" as nom_categorie_socprof,
    "Date de début du mandat" as date_debut_mandat,
    source_url as source_scraper
FROM
    {{ ref('figure3a_2026') }}