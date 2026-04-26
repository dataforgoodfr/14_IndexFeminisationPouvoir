WITH concatenate_tables AS (

--GOUVERNEMENT (figures 1)
	select
		'figure1a' as figure,
		zone_geographique_type as institution_type,
		'Pouvoir exécutif' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		zone_geographique_libelle as entite_libelle,
		
		-- NO DATA
		CAST(NULL AS VARCHAR) as agence_libelle,
		CAST(NULL AS VARCHAR) as canton_code,
		CAST(NULL AS VARCHAR) as canton_libelle,
		CAST(NULL AS VARCHAR) as circonscription_code,
		CAST(NULL AS VARCHAR) as circonscription_libelle,
		CAST(NULL AS VARCHAR) as commune_code,
		CAST(NULL AS VARCHAR) as commune_libelle,
		CAST(NULL AS VARCHAR) as csp_code,
		CAST(NULL AS VARCHAR) as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		CAST(NULL AS VARCHAR) as departement_code,
		CAST(NULL AS VARCHAR) as departement_libelle,
		CAST(NULL AS VARCHAR) as groupe_politique_libelle,
		CAST(NULL AS VARCHAR) as pays_libelle,
		CAST(NULL AS VARCHAR) as prefecture_libelle,
		CAST(NULL AS VARCHAR) as region_code,
		CAST(NULL AS VARCHAR) as region_libelle
		
	FROM {{ ref('stg_figure1a') }}
	
	union ALL
	
	select
		'figure1b' as figure,
		zone_geographique_type as institution_type,
		'Pouvoir exécutif' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		zone_geographique_libelle as entite_libelle,
		
		-- NO DATA
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure1b') }} 
	
	union ALL
	
	select
		'figure1c' as figure,
		zone_geographique_type as institution_type,
		'Pouvoir exécutif' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		
		-- NO DATA
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure1c') }} 
	
	union ALL
	
	select
		'figure1d' as figure,
		zone_geographique_type as institution_type,
		'Pouvoir exécutif' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		zone_geographique_libelle as entite_libelle,
		
		-- NO DATA
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure1d') }}
	
	union ALL
	
	select
		'figure1e' as figure,
		zone_geographique_type as institution_type,
		'Pouvoir exécutif' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		zone_geographique_libelle as entite_libelle,
		
		-- NO DATA
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure1e') }}

--PARLEMENT (figures 2)
	union ALL
	
	select
		'figure2a' as figure,
		'parlement' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		NULL as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		code_circonscription as circonscription_code,
		regexp_replace(nom_circonscription, 'È', 'e') as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		cast(code_csp as varchar) as csp_code,
		libelle_csp as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		date_debut_mandat as date_debut_mandat,
		date_naissance as date_naissance,
		-- departement code and names for overseas territories are in collectivite_statut_part columns
		COALESCE(code_collectivite_statut_part, code_departement) as departement_code,
		COALESCE(nom_collectivite_statut_part, nom_departement) as departement_libelle,
		NULL as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure2a') }}
	
	union ALL
	
	select
		'figure2b' as figure,
		'parlement' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		NULL as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		-- circonscription code is in zone_geographique_libelle field
		SPLIT_PART(zone_geographique_libelle, ' - ', 3) as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		-- departement code and name is in zone_geographique_libelle field
		REGEXP_REPLACE(SPLIT_PART(zone_geographique_libelle, ' - ', 2), '.*\(([0-9]+)\).*', '\1') as departement_code,
		REGEXP_REPLACE(SPLIT_PART(zone_geographique_libelle, ' - ', 2), ' \([0-9]+\)', '') as departement_libelle,
		groupe_politique_libelle as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		-- Region name is in zone_geographique_libelle field
		SPLIT_PART(zone_geographique_libelle, ' - ', 1) as region_libelle
		
	FROM {{ ref('stg_figure2b') }}
	
	union ALL
	
	select
		'figure2c' as figure,
		'parlement' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		SPLIT_PART(zone_geographique_libelle, ' (', 1) as departement_libelle,
		groupe_politique_libelle as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure2c') }}
	
	union ALL
	
	select
		'figure2d' as figure,
		'parlement' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		NULL as poste_libelle,
		NULL as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		-- circonscription code is in zone_geographique_libelle field
		SPLIT_PART(zone_geographique_libelle, ' - ', 3) as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		-- departement code and name is in zone_geographique_libelle field
		REGEXP_REPLACE(SPLIT_PART(zone_geographique_libelle, ' - ', 2), '.*\(([0-9]+)\).*', '\1') as departement_code,
		REGEXP_REPLACE(SPLIT_PART(zone_geographique_libelle, ' - ', 2), ' \([0-9]+\)', '') as departement_libelle,
		groupe_politique_libelle as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		-- Region name is in zone_geographique_libelle field
		SPLIT_PART(zone_geographique_libelle, ' - ', 1) as region_libelle
		
	FROM {{ ref('stg_figure2d') }}

--SENAT (figures 3)
	union ALL
	
	select
		'figure3a' as figure,
		'senat' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		cast(id as varchar) as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		NULL as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		cast(code_csp as varchar) as csp_code,
		libelle_csp as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		date_debut_mandat as date_debut_mandat,
		date_naissance as date_naissance,
		-- departement code and names for overseas territories are in collectivite_statut_part columns
		COALESCE(code_collectivite_statut_part, code_departement) as departement_code,
		COALESCE(nom_collectivite_statut_part, libelle_departement) as departement_libelle,
		NULL as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure3a') }}
	
	union ALL
	
	select
		'figure3b' as figure,
		'senat' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		NULL as poste_libelle,
		source_url as source_url,
		poste_libelle as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		--groupe_politique_libelle exists but values are NULL / keep it for future updates
		cast(groupe_politique_libelle as varchar) as groupe_politique_libelle,
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure3b') }}
	
	union ALL
	
	select
		'figure3c' as figure,
		'senat' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		groupe_politique_libelle as groupe_politique_libelle, --need CASE WHEN to harmonize values with other tables
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure3c') }}
	
	union ALL
	
	select
		'figure3d' as figure,
		'senat' as institution_type,
		'Pouvoir parlementaire' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		--poste_libelle exists but values are NULL / keep it for future updates
		cast(poste_libelle as varchar) as poste_libelle,
		NULL as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		groupe_politique_libelle as groupe_politique_libelle, --need CASE WHEN to harmonize values with other tables
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure3d') }}
	
	

--PARLEMENT EUROPEEN (figure 4)
	union all
	
	select
		'figure4' as figure,
		'parlement_europeen' as institution_type,
		'Pouvoir local' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		cast(id as varchar) as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		NULL as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		cast(code_csp as varchar) as csp_code,
		libelle_csp as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		date_debut_mandat as date_debut_mandat,
		date_naissance as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure4') }}
	

--MAIRIE (figures 5)
	union all
	
	select
		'figure5a' as figure,
		'mairie' as institution_type,
		'Pouvoir local' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		cast(id as varchar) as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		NULL as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		code_commune as commune_code,
		libelle_commune as commune_libelle,
		cast(code_csp as varchar) as csp_code,
		libelle_csp as csp_libelle,
		date_debut_fonction as date_debut_fonction,
		date_debut_mandat as date_debut_mandat,
		date_naissance as date_naissance,
		-- departement code and names for overseas territories are in collectivite_statut_part columns
		COALESCE(cast(code_collectivite_statut_part as varchar), code_departement) as departement_code,
		COALESCE(nom_collectivite_statut_part, libelle_departement) as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure5a') }}
	
	union all
	
	select
		'figure5b' as figure,
		'mairie' as institution_type,
		'Pouvoir local' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		cast(id as varchar) as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		NULL as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		code_commune as commune_code,
		libelle_commune as commune_libelle,
		cast(code_csp as varchar) as csp_code,
		libelle_csp as csp_libelle,
		date_debut_fonction as date_debut_fonction,
		date_debut_mandat as date_debut_mandat,
		date_naissance as date_naissance,
		-- departement code and names for overseas territories are in collectivite_statut_part columns
		COALESCE(cast(code_collectivite_statut_part as varchar), code_departement) as departement_code,
		COALESCE(nom_collectivite_statut_part, libelle_departement) as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure5b') }}

--DEPARTEMENT (figures 6)
	union all
	
	select
		'figure6a' as figure,
		'departement' as institution_type,
		'Pouvoir local' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		nom_fonction as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		cast(code_canton as varchar) as canton_code,
		nom_canton as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		cast(code_csp as varchar) as csp_code,
		libelle_csp as csp_libelle,
		date_debut_fonction as date_debut_fonction,
		date_debut_mandat as date_debut_mandat,
		date_naissance as date_naissance,
		code_departement as departement_code,
		nom_departement as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure6a') }}
	
	union all
	
	select
		'figure6b' as figure,
		'departement' as institution_type,
		'Pouvoir local' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		--groupe_politique_libelle is null / Keep for future updates
		cast(groupe_politique_libelle as varchar) as groupe_politique_libelle, 
		NULL as pays_libelle,
		zone_geographique_libelle as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure6b') }}

--REGION (figures 7)
	union all
	
	select
		'figure7a' as figure,
		'region' as institution_type,
		'Pouvoir local' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		NULL as personne_civilite,
		nom_elu as personne_nom,
		prenom_elu as personne_prenom,
		libelle_fonction as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		cast(code_csp as varchar) as csp_code,
		libelle_csp as csp_libelle,
		date_fonction_debut as date_debut_fonction,
		date_mandat_debut as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		code_departement as departement_code,
		libelle_departement as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		code_region as region_code,
		libelle_region as region_libelle
		
	FROM {{ ref('stg_figure7a') }}
	
	union all
	
	select
		'figure7b' as figure,
		'region' as institution_type,
		'Pouvoir local' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		--groupe_politique_libelle is null / Keep for future updates
		cast(groupe_politique_libelle as varchar) as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		zone_geographique_libelle as region_libelle
		
	FROM {{ ref('stg_figure7b') }}

--HAUTE JURIDICTION (figure 8)
	union all
	
	select
		'figure8' as figure,
		'haute_juridiction' as institution_type,
		'Autre Pouvoir' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		zone_geographique_libelle as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure8') }}

--PREFECTURE
	union all
	
	select
		'figure9' as figure,
		'prefecture' as institution_type,
		'Autre Pouvoir' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		zone_geographique_libelle as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure9') }}

--AMBASSADE (figure 10)
	union all
	
	select
		'figure10' as figure,
		'ambassade' as institution_type,
		'Autre Pouvoir' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		NULL as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle, 
		zone_geographique_libelle as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure10') }}
	
--AGENCE (figure 11)
	union all
	
	select
		'figure11' as figure,
		'agence' as institution_type,
		'Autre Pouvoir' as pouvoir_type,
		annee_partition as annee_partition,
		genre as genre,
		id as id,
		personne_civilite as personne_civilite,
		personne_nom as personne_nom,
		personne_prenom as personne_prenom,
		poste_libelle as poste_libelle,
		source_url as source_url,
		NULL as entite_libelle,
		zone_geographique_libelle as agence_libelle,
		NULL as canton_code,
		NULL as canton_libelle,
		NULL as circonscription_code,
		NULL as circonscription_libelle,
		NULL as commune_code,
		NULL as commune_libelle,
		NULL as csp_code,
		NULL as csp_libelle,
		CAST(NULL AS DATE) as date_debut_fonction,
		CAST(NULL AS DATE) as date_debut_mandat,
		CAST(NULL AS DATE) as date_naissance,
		NULL as departement_code,
		NULL as departement_libelle,
		NULL as groupe_politique_libelle, 
		NULL as pays_libelle,
		NULL as prefecture_libelle,
		NULL as region_code,
		NULL as region_libelle
		
	FROM {{ ref('stg_figure11') }}

)

select 

		figure,
		institution_type,
		pouvoir_type,
		annee_partition,
		genre,
		id,
		personne_civilite,
		personne_nom,
		personne_prenom,
		poste_libelle,
		source_url,
		entite_libelle,
		agence_libelle,
		canton_code,
		canton_libelle,
		circonscription_code,
		circonscription_libelle,
		commune_code,
		commune_libelle,
		csp_code,
		csp_libelle,
		date_debut_fonction,
		date_debut_mandat,
		date_naissance,
		departement_code,
		departement_libelle,
		groupe_politique_libelle, 
		pays_libelle,
		prefecture_libelle,
		region_code,
		region_libelle
		
from concatenate_tables
order by 1,2,3,4