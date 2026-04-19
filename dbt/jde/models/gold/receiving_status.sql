{{ config(schema='gold', materialized='table') }}

SELECT
    h.order_id,
    h.company,
    h.order_type,
    h.vendor_id,
    a.address_name                                          AS vendor_name,
    h.business_unit,
    h.date_transaction,
    h.date_requested,
    h.date_promised,
    d.item_id,
    d.item_number,
    d.item_description,
    d.unit_of_measure,
    d.line_number,
    d.quantity_received,
    d.quantity_receipted                                    AS quantity_put_away,
    d.quantity_received - d.quantity_receipted              AS quantity_not_put_away,
    d.unit_cost,
    d.extended_amount,
    d.next_status,
    d.last_status,
    CASE
        WHEN d.next_status = '999'                          THEN 'Closed'
        WHEN d.next_status = '400'                          THEN 'Received - Pending Put-Away'
        WHEN d.next_status = '280'                          THEN 'Awaiting Receipt'
        ELSE 'In Progress'
    END                                                     AS receiving_status,
    CASE
        WHEN d.next_status = '999'                          THEN 'success'
        WHEN d.next_status = '400'                          THEN 'warning'
        WHEN d.next_status = '280'                          THEN 'info'
        ELSE 'default'
    END                                                     AS status_color,
    CURRENT_DATE - h.date_promised::date                    AS days_past_promise,
    CASE
        WHEN d.next_status != '999'
         AND CURRENT_DATE > h.date_promised::date           THEN true
        ELSE false
    END                                                     AS is_overdue
FROM silver.purchase_order_header h
JOIN silver.purchase_order_detail d ON h.order_id = d.order_id
LEFT JOIN silver.address_book a     ON h.vendor_id = a.address_id
