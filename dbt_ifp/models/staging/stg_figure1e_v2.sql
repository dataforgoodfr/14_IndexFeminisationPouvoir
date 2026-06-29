-- stg_figure1a_v2.sql
{% set start_year = 2026 %}
{% set current_year = modules.datetime.datetime.now().year %}


{{ config(
    vars = {
        'figure': "dir_cab_ministères",
        'schema_source': "sources",
        'suffixe': "oxfam"
    }
) }}


{% for year in range(start_year, current_year + 1) %}

{% set figure_src = var('schema_source') ~ '.' ~ var('figure') ~ '_' ~ var('suffixe') ~ '_' ~ year %}
{% set ref_figures_src = var('schema_source') ~ '.ref_figures_' ~ year %}

SELECT rf.figure,
    rf.pouvoir_type,
    rf.institution_type,
    {{ year }}  as  annee_partition,
    {{ dbt_utils.generate_surrogate_key(['t.nom', 't.prenom']) }} AS personne_id,
    t.civilite as personne_civilite,
    t.prenom as  personne_prenom,
    t.nom as personne_nom,
    case  when t.civilite = 'M.' then 'M'
	    when t.civilite = 'Mme' then 'F' 
	    else null 
	end as personne_genre,
    t.fonction as poste_libelle,
    t.administration as entite_libelle,
    'Annuaire Administration' as    source_url
from {{ figure_src }}  t
    , {{ ref_figures_src }} rf 
where rf.nom =  '{{ var('figure') }}'

{% if not loop.last %} UNION ALL {% endif %}
{% endfor %}