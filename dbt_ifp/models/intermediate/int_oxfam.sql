{% set tables_administration = [
    "gouvernement",
    "gouv_postes_regaliens",
    "cabinet_president",
    "cabinet_premier_ministre",
    "dir_cab_ministeres",
    "hautes_juridictions",
    "prefectures",
    "ambassades",
    "agences_hautes_autorites"
] %}

{% set tables_elections = [
    "parlement_europeen",
    "mairies",
    "mairies_prefectures",
    "mairies_plm_arr",
    "conseils_regions",
    "conseils_departements"
] %}

{% set start_year = 2026 %}
{% set end_year = modules.datetime.date.today().year %}

-- 1) UNION ALL administration
with union_all_sources_administration as (

    {% set selects = [] %}

    {% for annee in range(start_year, end_year + 1) %}
        {% for base in tables_administration %}
            {% set base_oxfam = base ~ '_oxfam' %}

            {% set sql %}
                select
                    '{{ base }}' as table_source,
                    {{ annee }} as annee,
                    nom,
                    prenom,
                    civilite,
                    null as genre,
                    fonction,
                    modification,
                    commentaires
                from {{ ref(base_oxfam ~ '_' ~ annee) }}
            {% endset %}

            {% do selects.append(sql) %}
        {% endfor %}
    {% endfor %}

    {{ selects | join("\n\nunion all\n\n") }}

),

-- 2) UNION ALL élections
union_all_sources_elections as (

    {% set selects = [] %}

    {% for annee in range(start_year, end_year + 1) %}
        {% for base in tables_elections %}
            {% set base_oxfam = base ~ '_oxfam' %}

            {% set sql %}
                select
                    '{{ base }}' as table_source,
                    {{ annee }} as annee,
                    nom,
                    prenom,
                    null as civilite,
                    genre,
                    null as fonction,
                    modification,
                    commentaires
                from {{ ref(base_oxfam ~ '_' ~ annee) }}
            {% endset %}

            {% do selects.append(sql) %}
        {% endfor %}
    {% endfor %}

    {{ selects | join("\n\nunion all\n\n") }}

),

-- 3) UNION ALL global administration + élections
union_all_sources as (
    select * from union_all_sources_administration
    union all
    select * from union_all_sources_elections
),

-- 4) Jointure dynamique avec ref_figures_{{ annee }}
joined as (

    {% set joins = [] %}

    {% for annee in range(start_year, end_year + 1) %}
        {% set join_sql %}
            select
                u.*,
                f.pouvoir_type
            from union_all_sources u
            left join {{ ref('ref_figures_' ~ annee) }} f
                on u.table_source = f.nom
            where u.annee = {{ annee }}
        {% endset %}

        {% do joins.append(join_sql) %}
    {% endfor %}

    {{ joins | join("\n\nunion all\n\n") }}

)

select * from joined
