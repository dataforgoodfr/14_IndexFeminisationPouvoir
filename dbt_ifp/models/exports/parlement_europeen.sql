-- models/parlement_europeen.sql



{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set parl_europeen_src = var('schema_source') ~ '.parlement_europeen_' ~ var('annee') %}


select m.*
from  {{ parl_europeen_src }} m


