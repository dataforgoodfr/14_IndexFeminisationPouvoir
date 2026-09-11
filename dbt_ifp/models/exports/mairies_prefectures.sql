-- models/mairies.sql



{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set mairies_src = var('schema_source') ~ '.mairies_' ~ var('annee') %}
{% set departements_src = var('schema_source') ~ '.v_departement_2024' %}

select d."DEP" as code_departement, 
	d."LIBELLE" as departement,
    m.*
from  {{ departements_src }} d
left outer join {{ mairies_src }} m
on d."CHEFLIEU" = m.code_commune
where fonction = 'Maire'

