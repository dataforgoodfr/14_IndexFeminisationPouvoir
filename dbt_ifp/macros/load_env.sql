{% macro load_env(path) %}
    {% set lines = load_file(path).splitlines() %}
    {% set env = {} %}
    {% for line in lines %}
        {% if "=" in line %}
            {% set key, value = line.split("=", 1) %}
            {% do env.update({ key: value }) %}
        {% endif %}
    {% endfor %}
    {{ return(env) }}
{% endmacro %}
