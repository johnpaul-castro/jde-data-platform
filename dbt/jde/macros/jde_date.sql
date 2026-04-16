{% macro jde_date(field) %}
    CASE 
        WHEN {{ field }} IS NULL OR TRIM({{ field }}) = '' OR TRIM({{ field }}) = '0'
        THEN NULL
        ELSE (
            '1900-01-01'::date 
            + (TRIM({{ field }})::integer / 1000) * interval '1 year' 
            + ((TRIM({{ field }})::integer % 1000) - 1) * interval '1 day'
        )::date
    END
{% endmacro %}
