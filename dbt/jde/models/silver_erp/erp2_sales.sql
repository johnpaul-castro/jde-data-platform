SELECT
    'erp2'              AS source_system,
    ordid               AS order_id,
    custnum             AS source_customer_id,
    orddt               AS order_date,
    ordamt              AS order_amount,
    NULL                AS currency_code,
    loaded_at
FROM {{ source('bronze_erp2', 'sales') }}