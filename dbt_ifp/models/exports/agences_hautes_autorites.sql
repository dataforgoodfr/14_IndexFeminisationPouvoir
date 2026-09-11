-- models/agences_hautes_autorites.sql



{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set ann_admin_src = var('schema_source') ~ '.administration_' ~ var('annee') %}
{% set ref_agences_hautes_autorites_src = var('schema_source') ~ '.ref_agences_hautes_autorites_' ~ var('annee') %}

-- with ref as (
--     select
--         "Administration" as administration,
--         "Fonction" as fonction
--     from {{ ref_agences_hautes_autorites_src }}
-- )
select
    r.administration,
    a.nom,
    a.prenom,
    a.civilite,
    a.fonction,
    a.type_organisme
from  {{ ref_agences_hautes_autorites_src }} r
left join {{ ann_admin_src }}  a
        on a.administration = r.administration
        and a.fonction similar to r.fonction

