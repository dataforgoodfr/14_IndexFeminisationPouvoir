SELECT
    personne_raw_text,
    personne_nom_complet,
    personne_civilite,
    personne_prenom,
    personne_nom,
    personne_genre,
    groupe_politique_libelle,
    poste_libelle,
    zone_geographique_libelle,
    zone_geographique_type,
    source_url
FROM 
    {{ ref('figure6b_20260320_140724') }}