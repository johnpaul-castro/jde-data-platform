SELECT
    'erp4'              AS source_system,
    so_num              AS order_id,
    cust_key            AS source_customer_id,
    so_dt               AS order_date,
    so_amt              AS order_amount,
    NULL                AS currency_code,
    loaded_at
FROM {{ source('bronze_erp4', 'sales') }}