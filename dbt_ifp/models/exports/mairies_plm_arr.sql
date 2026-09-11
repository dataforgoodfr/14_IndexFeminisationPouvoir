-- models/mairies_plm_arr.sql



{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set mairies_plm_arr_src = var('schema_source') ~ '.mairies_plm_arr_' ~ var('annee') %}


select m.*
from  {{ mairies_plm_arr_src }} m
where fonction = 'Maire d''arrondissement'

