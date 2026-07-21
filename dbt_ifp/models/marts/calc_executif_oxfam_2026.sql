with personnes_admin_distinct as 
(select distinct table_source, annee, nom, prenom, civilite,
	case when civilite = 'Mme' then 'F' 
		when civilite = 'M.' then 'M'
		else null
	end as personne_genre
	from {{ ref('int_executif_oxfam') }}
	where (modification is null or modification != 'Supprimé')
		and civilite is not null
)
, calc_admin_2026 as
(select 
	annee,
	table_source,
	SUM(case when personne_genre = 'F' then 1 else 0 END) as total_femmes,
	COUNT(*) as total_personnes,
	ROUND(SUM(case when personne_genre = 'F' then 1.0 else 0 END) / NULLIF(COUNT(*), 0)*100, 1) as pct_femmes
from personnes_admin_distinct
where annee = 2026
group by 1,2
)

select
	a.annee,
	r.pouvoir_categorie,
	r.pouvoir_type,
	r.pouvoir_composante,
	r.figure,
	r.institution_type,
	a.total_femmes,
	a.total_personnes,
	a.pct_femmes,
	b.pct_femmes::numeric as pct_femmes_2025,
	(a.pct_femmes - b.pct_femmes::numeric) as evolution
from calc_admin_2026 a
inner join {{ ref('ref_figures_2026') }} r
on a.table_source = r.nom
left join {{ ref('calculated_figures_2025') }} b on r.figure = b.figure 