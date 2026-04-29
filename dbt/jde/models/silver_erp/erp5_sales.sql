SELECT
    'erp5'              AS source_system,
    ord_num             AS order_id,
    cust_id             AS source_customer_id,
    ord_date            AS order_date,
    ord_amt             AS order_amount,
    NULL                AS currency_code,
    loaded_at
FROM {{ source('bronze_erp5', 'sales') }}