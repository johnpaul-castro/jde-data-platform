{{ config(schema='gold', materialized='table') }}

SELECT
    h.order_id,
    h.company,
    h.order_type,
    h.sold_to_id                                    AS customer_id,
    a.address_name                                  AS customer_name,
    h.business_unit,
    h.date_requested,
    h.date_promised,
    h.date_transaction,
    d.item_id,
    d.item_number,
    d.item_description,
    d.unit_of_measure,
    d.line_number,
    d.quantity_ordered,
    d.quantity_shipped,
    d.quantity_ordered - d.quantity_shipped         AS quantity_remaining,
    d.unit_price,
    d.extended_amount,
    d.next_status,
    d.last_status,
    CASE
        WHEN d.next_status = '999'               THEN 'Closed'
        WHEN d.next_status = '620'               THEN 'Shipped'
        WHEN d.next_status = '560'               THEN 'Ready to Ship'
        ELSE 'In Progress'
    END                                             AS shipment_status,
    CASE
        WHEN d.next_status = '999'               THEN 'success'
        WHEN d.next_status = '620'               THEN 'info'
        WHEN d.next_status = '560'               THEN 'warning'
        ELSE 'default'
    END                                             AS status_color,
    CURRENT_DATE - h.date_promised::date            AS days_past_promise,
    CASE
        WHEN d.next_status != '999'
         AND CURRENT_DATE > h.date_promised::date  THEN true
        ELSE false
    END                                             AS is_overdue
FROM silver.sales_order_header h
JOIN silver.sales_order_detail d ON h.order_id = d.order_id
LEFT JOIN silver.address_book a  ON h.sold_to_id = a.address_id
