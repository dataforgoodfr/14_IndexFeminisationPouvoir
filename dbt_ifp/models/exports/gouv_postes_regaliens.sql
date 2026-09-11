-- models/exports/gouv_postes_regaliens.sql


{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set ann_admin_src = var('schema_source') ~ '.administration_' ~ var('annee') %}
{% set ref_postes_regaliens_src = var('schema_source') ~ '.ref_postes_regaliens_' ~ var('annee') %}


select
    a.administration,
    nom,
    prenom,
    civilite,
    a.fonction,
    type_organisme
from {{ ann_admin_src }} a
inner join {{ ref_postes_regaliens_src }} r
    on a.administration = r.administration
    and a.fonction =  r.fonction
-- where 
--     fonction ilike any (array[
--     'Ministre%',
--     'Premier ministre',
--     'Première ministre',
--     'Garde des Sceaux, ministre%'])
