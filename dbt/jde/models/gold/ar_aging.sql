{{ config(
    schema='gold',
    materialized='table'
) }}

SELECT
    ar.customer_id,
    a.address_name                        AS customer_name,
    COUNT(ar.document_id)                 AS invoice_count,
    SUM(ar.amount_gross)                  AS total_invoiced,
    SUM(ar.amount_open)                   AS total_open,
    SUM(ar.amount_discount)               AS total_discount,
    SUM(CASE WHEN ar.pay_status = 'A' THEN ar.amount_open ELSE 0 END) AS amount_current,
    SUM(CASE WHEN ar.pay_status = 'P' THEN ar.amount_open ELSE 0 END) AS amount_past_due,
    ar.currency_code
FROM {{ ref('ar_invoices') }} ar
LEFT JOIN {{ ref('address_book') }} a ON ar.customer_id = a.address_id
GROUP BY ar.customer_id, a.address_name, ar.currency_code
ORDER BY total_open DESC
