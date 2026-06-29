-- models/ambassades.sql


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
where (
    (fonction ilike 'Ambassadeur%' or fonction ilike 'Ambassadrice%')
    and administration not ilike 'Section consulaire%'
)
or (fonction ilike any (array[
    'Représentante permanente%',
    'Représentant permanent%',
    'Déléguée permanente%', 
    'Délégué permanent%'])
    and fonction not ilike '%adjoint%'
)
