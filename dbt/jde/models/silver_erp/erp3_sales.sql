SELECT
    'erp3'              AS source_system,
    order_id            AS order_id,
    customer_number     AS source_customer_id,
    order_date          AS order_date,
    order_amount        AS order_amount,
    NULL                AS currency_code,
    loaded_at
FROM {{ source('bronze_erp3', 'sales') }}