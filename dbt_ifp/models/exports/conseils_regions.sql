-- models/conseils_regions.sql



{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set mairies_src = var('schema_source') ~ '.conseils_regions_' ~ var('annee') %}


select m.*
from  {{ mairies_src }} m
where fonction = 'Président du conseil régional'

