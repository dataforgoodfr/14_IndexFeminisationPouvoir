{% set tables = {
    "gouvernement": "gouvernement_oxfam",
    "gouv_postes_regaliens": "gouv_postes_regaliens_oxfam",
    "cabinet_president": "cabinet_president_oxfam",
    "cabinet_premier_ministre": "cabinet_premier_ministre_oxfam",
    "dir_cab_ministeres": "dir_cab_ministeres_oxfam"
} %}

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

{% set selects = [] %}

{% for annee in range(start_year, end_year + 1) %}
    {% for alias, base in tables.items() %}
        {% set sql %}
            select
                '{{ alias }}' as table_source,
                {{ annee }} as annee,
                {% for col in cols %}
                    {{ col }}{% if not loop.last %},{% endif %}
                {% endfor %}
            from {{ ref(base ~ '_' ~ annee) }}
        {% endset %}
        {% do selects.append(sql) %}
    {% endfor %}
{% endfor %}

{{ selects | join("\n\nunion all\n\n") }}
