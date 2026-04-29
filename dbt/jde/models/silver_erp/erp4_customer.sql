SELECT
    'erp4'              AS source_system,
    cust_key            AS source_customer_id,
    name                AS customer_name,
    addr_line_1         AS address_line_1,
    city_name           AS city,
    st                  AS state_province,
    zip_cd              AS postal_code,
    NULL                AS country,
    tax_id              AS tax_id,
    email_addr          AS email,
    loaded_at
FROM {{ source('bronze_erp4', 'customer') }}