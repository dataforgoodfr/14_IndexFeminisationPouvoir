-- models/cabinet_premier_ministre.sql


{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set ann_admin_src = var('schema_source') ~ '.administration_' ~ var('annee') %}
{% set admin_hier_src = var('schema_source') ~ '.administration_hierarchies_' ~ var('annee') %}

with sous_admin as (
    select
        sous_administration
    from {{ admin_hier_src }}
    where administration = 'Cabinet du Premier ministre' 
    or administration = 'Cabinet de la Première ministre'
),

admin_final as (
    select 'Cabinet du Premier ministre' as administration

    union
    select 'Cabinet de la Première ministre' as administration
    
    union
    select sous_administration
    from sous_admin
)

select
    a.administration,
    a.nom,
    a.prenom,
    a.civilite,
    a.fonction,
    a.type_organisme
from {{ ann_admin_src }} a
join admin_final f on a.administration = f.administration
