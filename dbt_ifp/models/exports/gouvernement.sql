-- models/exports/gouvernement.sql


{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}


{% set ann_admin_src = var('schema_source') ~ '.administration_' ~ var('annee') %}


select
    administration,
    nom,
    prenom,
    civilite,
    fonction,
    type_organisme
from {{ ann_admin_src }}
where 
    fonction ilike any (array[
    'Ministre%',
    'Premier ministre',
    'Première ministre',
    'Garde des Sceaux, ministre%'])
