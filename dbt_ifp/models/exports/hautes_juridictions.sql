-- models/hautes_juridictions


{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set ann_admin_src = var('schema_source') ~ '.administration_' ~ var('annee') %}
{% set ref_hautes_juridictions_src = var('schema_source') ~ '.ref_hautes_juridictions_' ~ var('annee') %}

with ref as (
    select
        "administration" as administration,
        "fonction" as fonction
    from {{ ref_hautes_juridictions_src }}
),

fonctions as (
    select
        administration,
        regexp_split_to_table(fonction, '\|') as fonction
    from ref
),

annuaire as (
    select
        a.*
    from {{ ann_admin_src}} a
    inner join fonctions f
        on a.administration = f.administration
       and a.fonction = f.fonction
)

select
    r.administration,
    a.nom,
    a.prenom,
    a.civilite,
    a.fonction,
    a.type_organisme
from ref r
left join annuaire a
        on r.administration = a.administration

