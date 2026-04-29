SELECT
    'erp1'              AS source_system,
    sales_order_no      AS order_id,
    cust_id             AS source_customer_id,
    sales_order_dt      AS order_date,
    sales_order_amt     AS order_amount,
    currency_cd         AS currency_code,
    loaded_at
FROM {{ source('bronze_erp1', 'sales') }}