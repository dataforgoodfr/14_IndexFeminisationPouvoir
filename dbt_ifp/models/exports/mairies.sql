-- models/mairies.sql



{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set mairies_src = var('schema_source') ~ '.mairies_' ~ var('annee') %}


select m.*
from  {{ mairies_src }} m
where fonction = 'Maire'

