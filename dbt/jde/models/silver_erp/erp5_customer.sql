SELECT
    'erp5'              AS source_system,
    cust_id             AS source_customer_id,
    cust_name           AS customer_name,
    addr1               AS address_line_1,
    city                AS city,
    state               AS state_province,
    zip                 AS postal_code,
    NULL                AS country,
    tax_id              AS tax_id,
    email               AS email,
    loaded_at
FROM {{ source('bronze_erp5', 'customer') }}