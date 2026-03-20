SELECT
    CAST("__id" AS VARCHAR) AS id,
    CAST("Code de la région" AS VARCHAR) AS code_region,
    "Libellé de la région" AS libelle_region,
    CAST("Code de la section départementale" AS VARCHAR) AS code_dep,
    "Libellé de la section départementale" AS libelle_dep,
    "Nom de l'élu" AS nom_elu,
    "Prénom de l'élu" AS prenom_elu,
    "Code sexe" AS code_sexe,
    "Date de naissance" AS date_naissance,
    CAST("Code de la catégorie socio-professionnelle" AS VARCHAR) AS code_pcs,
    "Libellé de la catégorie socio-professionnelle" AS libelle_pcs,
    "Date de début du mandat" AS date_mandat_debut,
    "Libellé de la fonction" AS libelle_fonction,
    "Date de début de la fonction" AS date_fonction_debut,
    source_url
FROM
        {{ ref('figure7a_20260320_140724') }}
