{{ config(
    schema='gold',
    materialized='table'
) }}

SELECT
    h.vendor_id,
    a.address_name                        AS vendor_name,
    COUNT(DISTINCT h.order_id)            AS total_orders,
    SUM(d.quantity_received)              AS total_received,
    SUM(d.extended_amount)                AS total_spend,
    AVG(d.unit_cost)                      AS avg_unit_cost,
    MAX(h.date_updated)               AS last_order_date
FROM {{ ref('purchase_order_header') }} h
JOIN {{ ref('purchase_order_detail') }} d ON h.order_id = d.order_id
LEFT JOIN {{ ref('address_book') }} a ON h.vendor_id = a.address_id
GROUP BY h.vendor_id, a.address_name
ORDER BY total_spend DESC
