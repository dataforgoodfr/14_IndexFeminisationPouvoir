-- models/prefectures.sql

{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set ann_admin_src = var('schema_source') ~ '.administration_' ~ var('annee') %}

select
    administration, nom, prenom, civilite, fonction, type_organisme, code_insee_commune
from {{ ann_admin_src }}
where fonction ilike any (array[
    'Préfet%',
    'Préfète%',
    'Haut-commissaire de la République%',
    'Représentant de l''État%',
    'Représentante de l''État%'])
and fonction not ilike '%délégué%'
and (administration not ilike '%région%'
    or administration = 'Préfecture de région - Île-de-France et Paris')


 