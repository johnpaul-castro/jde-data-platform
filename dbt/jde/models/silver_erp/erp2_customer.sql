SELECT
    'erp2'              AS source_system,
    custnum             AS source_customer_id,
    custname            AS customer_name,
    addrln1             AS address_line_1,
    citynm              AS city,
    stprov              AS state_province,
    postcd              AS postal_code,
    NULL                AS country,
    tin                 AS tax_id,
    emladdr             AS email,
    loaded_at
FROM {{ source('bronze_erp2', 'customer') }}