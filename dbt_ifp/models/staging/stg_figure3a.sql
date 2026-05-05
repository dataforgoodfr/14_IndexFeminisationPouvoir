{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}


{% for year in range(start_year, current_year + 1) %}
SELECT
    'figure3a' as figure,
	'senat' as institution_type,
	'Pouvoir parlementaire' as pouvoir_type,
    {{ year }} as annee_partition,
    -- {{ dbt_utils.generate_surrogate_key(["Nom de l'élu" , "Prénom de l'élu"]) }} AS personne_id,
    __id as personne_id,
    -- departement code and names for overseas territories are in collectivite_statut_part columns
	COALESCE("Code de la collectivité à statut particulier", "Code du département") as departement_code,
	COALESCE("Libellé de la collectivité à statut particulier", "Libellé du département") as departement_libelle,
    "Nom de l'élu" as personne_nom,
    "Prénom de l'élu" as personne_prenom,
    "Code sexe" as personne_genre,
    "Date de naissance" as date_naissance,
    CAST("Code de la catégorie socio-professionnelle" as TEXT) as csp_code,
    "Libellé de la catégorie socio-professionnelle" as csp_libelle,
    "Date de début du mandat" as date_debut_mandat,
    source_url
FROM
    {{ ref('figure3a_' ~ year) }}
{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}