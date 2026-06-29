with figures_distinct_2026 as 
(select distinct
	pouvoir_type,
	institution_type,
	figure,
	personne_id,
	personne_genre
from {{ ref('int_concat_figures_v2_2026') }}
where personne_genre is not null
)
, figures_2026 as
(select distinct
	pouvoir_type,
	institution_type,
	figure,
	SUM(case when personne_genre = 'F' then 1 else 0 END) as total_femmes,
	COUNT(*) as total_personnes,
	ROUND(SUM(case when personne_genre = 'F' then 1.0 else 0 END) / NULLIF(COUNT(*), 0)*100, 1) as pct_femmes
from figures_distinct_2026
group by 1,2,3

)

select
	a.pouvoir_type,
	a.institution_type,
	a.figure,
	a.total_femmes,
	a.total_personnes,
	a.pct_femmes,
	b.pct_femmes::numeric as pct_femmes_2025,
	(a.pct_femmes - b.pct_femmes::numeric) as evolution
from figures_2026 a
left join {{ ref('calculated_figures_2025') }} b on a.figure = b.figure