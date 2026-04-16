CREATE SCHEMA IF NOT EXISTS gold;

DROP MATERIALIZED VIEW IF EXISTS gold.sales_by_customer CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gold.ar_aging CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gold.inventory_status CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gold.purchasing_by_vendor CASCADE;

CREATE MATERIALIZED VIEW gold.sales_by_customer AS
SELECT
    h.sold_to_id                          AS customer_id,
    a.address_name                        AS customer_name,
    COUNT(DISTINCT h.order_id)            AS total_orders,
    SUM(d.quantity_ordered)               AS total_quantity,
    SUM(d.extended_amount)                AS total_revenue,
    AVG(d.unit_price)                     AS avg_unit_price,
    MAX(h.date_transaction)               AS last_order_date
FROM silver.sales_order_header h
JOIN silver.sales_order_detail d ON h.order_id = d.order_id
LEFT JOIN silver.address_book a ON h.sold_to_id = a.address_id
GROUP BY h.sold_to_id, a.address_name
WITH NO DATA;

CREATE UNIQUE INDEX idx_gold_sales_by_customer ON gold.sales_by_customer (customer_id);

CREATE MATERIALIZED VIEW gold.ar_aging AS
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
FROM silver.ar_invoices ar
LEFT JOIN silver.address_book a ON ar.customer_id = a.address_id
GROUP BY ar.customer_id, a.address_name, ar.currency_code
WITH NO DATA;

CREATE UNIQUE INDEX idx_gold_ar_aging ON gold.ar_aging (customer_id, currency_code);

CREATE MATERIALIZED VIEW gold.inventory_status AS
SELECT
    i.item_id,
    i.item_number,
    i.item_description,
    i.unit_of_measure,
    i.gl_class,
    i.product_group,
    b.business_unit,
    b.quantity_on_hand,
    b.quantity_on_order,
    b.cost_average,
    b.price_list,
    ROUND(b.quantity_on_hand * b.cost_average, 2) AS inventory_value
FROM silver.item_master i
LEFT JOIN silver.item_branch b ON i.item_id = b.item_id
WHERE b.quantity_on_hand > 0
WITH NO DATA;

CREATE UNIQUE INDEX idx_gold_inventory_status ON gold.inventory_status (item_id, business_unit);

CREATE MATERIALIZED VIEW gold.purchasing_by_vendor AS
SELECT
    h.vendor_id,
    a.address_name                        AS vendor_name,
    COUNT(DISTINCT h.order_id)            AS total_orders,
    SUM(d.quantity_received)              AS total_received,
    SUM(d.extended_amount)                AS total_spend,
    AVG(d.unit_cost)                      AS avg_unit_cost,
    MAX(h.date_transaction)               AS last_order_date
FROM silver.purchase_order_header h
JOIN silver.purchase_order_detail d ON h.order_id = d.order_id
LEFT JOIN silver.address_book a ON h.vendor_id = a.address_id
GROUP BY h.vendor_id, a.address_name
WITH NO DATA;

CREATE UNIQUE INDEX idx_gold_purchasing_by_vendor ON gold.purchasing_by_vendor (vendor_id);
