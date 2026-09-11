-- models/conseils_departements.sql



{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set mairies_src = var('schema_source') ~ '.conseils_departements_' ~ var('annee') %}


select m.*
from  {{ mairies_src }} m
where fonction = 'Président du conseil départemental'

