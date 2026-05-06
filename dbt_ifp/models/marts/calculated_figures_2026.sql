with figures_2026 as 
(select
	pouvoir_type,
	institution_type,
	figure,
	ROUND(SUM(case when personne_genre = 'F' then 1.0 else 0 END) / NULLIF(COUNT(*), 0)*100, 1) as pct_femmes
from {{ ref('int_concat_figures_2026') }}
group by 1,2,3

)

select
	a.pouvoir_type,
	a.institution_type,
	a.figure,
	a.pct_femmes,
	b.pct_femmes::numeric as pct_femmes_2025,
	(a.pct_femmes - b.pct_femmes) as evolution
from figures_2026 a
left join {{ ref('calculated_figures_2025') }} b on a.figure = b.figure