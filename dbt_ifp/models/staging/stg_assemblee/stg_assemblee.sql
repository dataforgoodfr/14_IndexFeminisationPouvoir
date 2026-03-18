with assemblee as (
    select * from {{ ref('figure2c') }}
),

renamed as (
    select
        md5(personne_prenom || personne_nom) as id,
        personne_prenom as prenom_elu,
        personne_nom as nom_elu,
        personne_genre as genre,
        groupe_politique_libelle,
        poste_libelle,
        zone_geographique_libelle,
        zone_geographique_type
    from assemblee
)

select *
from renamed
