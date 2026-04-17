{{ config(
    schema='gold',
    materialized='table'
) }}

SELECT
    h.sold_to_id                         AS customer_id,
    a.address_name                        AS customer_name,
    COUNT(DISTINCT h.order_id)            AS total_orders,
    SUM(d.quantity_ordered)               AS total_quantity,
    SUM(d.extended_amount)                AS total_revenue,
    AVG(d.unit_price)                     AS avg_unit_price,
    MAX(h.date_updated)               AS last_order_date
FROM {{ ref('sales_order_header') }} h
JOIN {{ ref('sales_order_detail') }} d ON h.order_id = d.order_id
LEFT JOIN {{ ref('address_book') }} a ON h.sold_to_id = a.address_id
GROUP BY h.sold_to_id, a.address_name
ORDER BY total_revenue DESC
