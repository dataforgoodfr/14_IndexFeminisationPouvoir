{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if node.resource_type == 'seed' or target.name == 'prod' -%}
        {# Seeds always use the custom schema directly (e.g. sources).
           Prod models do the same (e.g. staging, intermediate, mart). #}
        {%- if custom_schema_name is not none -%}
            {{ custom_schema_name | trim }}
        {%- else -%}
            {{ target.schema | trim }}
        {%- endif -%}

    {%- elif target.name == 'dev' -%}
        {# All models land in a single dev schema, ignoring layer config #}
        {{ target.schema | trim }}

    {%- else -%}
        {# preprod (and any other future target): dbt default behaviour
           {target.schema}_{custom_schema} e.g. preprod_staging #}
        {%- if custom_schema_name is not none -%}
            {{ target.schema | trim }}_{{ custom_schema_name | trim }}
        {%- else -%}
            {{ target.schema | trim }}
        {%- endif -%}

    {%- endif -%}
{%- endmacro %}