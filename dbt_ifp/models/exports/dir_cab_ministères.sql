-- models/dir_cab_ministères.sql


{{ config(
    schema = "exports"
) }}


{{ log(this.schema, info=True) }}

{% set ann_admin_src = var('schema_source') ~ '.administration_' ~ var('annee') %}

select
    administration,
    nom,
    prenom,
    civilite,
    fonction,
    type_organisme
from {{ ann_admin_src }}
where
    administration ilike any (array[
        'Cabinet du ministre%',
        'Cabinet de la ministre%',
        'Cabinet % garde des Sceaux%',
        'Cabinet % ministre des Armées%',
        'Cabinet du Premier ministre',
        'Cabinet de la Première ministre'
    ])
    and fonction ilike any (array[
        'Directeur d% cabinet',
        'Directrice d% cabinet'
    ])
