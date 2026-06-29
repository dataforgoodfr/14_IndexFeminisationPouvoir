{% set tables = {
    "gouvernement": "gouvernement_oxfam",
    "gouv_postes_régaliens": "gouv_postes_régaliens_oxfam",
    "cabinet_président": "cabinet_président_oxfam",
    "cabinet_premier_ministre": "cabinet_premier_ministre_oxfam",
    "dir_cab_ministères": "dir_cab_ministères_oxfam"
} %}

{% set start_year = 2026 %}
{% set end_year = modules.datetime.date.today().year %}

{% set selects = [] %}

{% for annee in range(start_year, end_year + 1) %}
    {% for alias, base in tables.items() %}
        {% set sql %}
            select
                '{{ alias }}' as table_source,
                {{ annee }} as annee,
                *
            from {{ ref(base ~ '_' ~ annee) }}
        {% endset %}
        {% do selects.append(sql) %}
    {% endfor %}
{% endfor %}

{{ selects | join("\n\nunion all\n\n") }}
