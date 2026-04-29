SELECT
    'erp3'              AS source_system,
    customer_number     AS source_customer_id,
    customer_name       AS customer_name,
    street1             AS address_line_1,
    city                AS city,
    state_code          AS state_province,
    postal_code         AS postal_code,
    NULL                AS country,
    federal_tax_id      AS tax_id,
    contact_email       AS email,
    loaded_at
FROM {{ source('bronze_erp3', 'customer') }}