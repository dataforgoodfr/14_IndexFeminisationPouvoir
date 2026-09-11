select 
	annee,
	pouvoir_type,
	AVG(pct_femmes) as pct_femmes,
	AVG(pct_femmes_2025) as pct_femmes_2025,
	AVG(pct_femmes) - AVG(pct_femmes_2025) as evolution
from {{ ref('calc_oxfam_2026') }}
group by 1,2
