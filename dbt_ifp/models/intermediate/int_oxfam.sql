{% set tables = [
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

{% set cols = [
    "nom",
    "prenom",
    "civilite",
    "fonction",
    "modification",
    "commentaires"
] %}

{% set start_year = 2026 %}
{% set end_year = modules.datetime.date.today().year %}

-- 1) UNION ALL de toutes les tables
with union_all_sources as (

    {% set selects = [] %}

    {% for annee in range(start_year, end_year + 1) %}
        {% for base in tables %}
            {% set base_oxfam = base ~ '_oxfam' %}

            {% set col_selects = [] %}
            {% for col in cols %}
                {% do col_selects.append(col ~ " as " ~ col) %}
            {% endfor %}

            {% set sql %}
                select
                    '{{ base }}' as table_source,
                    {{ annee }} as annee,
                    {{ col_selects | join(",\n                    ") }}
                from {{ ref(base_oxfam ~ '_' ~ annee) }}
            {% endset %}

            {% do selects.append(sql) %}
        {% endfor %}
    {% endfor %}

    {{ selects | join("\n\nunion all\n\n") }}

),

-- 2) Jointure dynamique avec ref_figures_{{ annee }}
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
