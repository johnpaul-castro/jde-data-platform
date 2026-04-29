SELECT
    'erp1'              AS source_system,
    cust_id             AS source_customer_id,
    cust_name           AS customer_name,
    cust_address        AS address_line_1,
    cust_town           AS city,
    cust_county         AS state_province,
    cust_postcode       AS postal_code,
    cust_country        AS country,
    cust_vat_no         AS tax_id,
    cust_email          AS email,
    loaded_at
FROM {{ source('bronze_erp1', 'customer') }}