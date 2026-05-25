CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.sales_orders_enriched
COMMENT 'Joined Sales Order Header + Detail with Customer and Item names - Gold'
AS SELECT
    d.order_number
    ,d.order_type
    ,d.order_company
    ,d.line_number
    ,h.customer_id
    ,ab.customer_name
    ,h.ship_to_id
    ,d.item_id
    ,im.item_number
    ,COALESCE(im.item_description, d.item_description)  AS item_description
    ,im.product_group
    ,d.business_unit
    ,d.unit_of_measure
    ,d.quantity_ordered
    ,d.price_unit
    ,d.amount_extended
    ,h.amount_order
    ,h.date_order
    ,h.date_requested
    ,h.date_promised
    ,h.currency_code
    ,d.next_status
    ,d.last_status
FROM jde_demo.silver.f4211_cleansed d
INNER JOIN jde_demo.silver.f4201_cleansed h
    ON  d.order_number  = h.order_number
    AND d.order_type    = h.order_type
    AND d.order_company = h.order_company
LEFT JOIN jde_demo.silver.f0101_cleansed ab
    ON h.customer_id = ab.address_id
LEFT JOIN jde_demo.silver.f4101_cleansed im
    ON d.item_id = im.item_id;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.daily_sales_summary
COMMENT 'Daily Sales Summary by Customer - Gold'
AS SELECT
    date_order
    ,customer_id
    ,customer_name
    ,order_company
    ,COUNT(DISTINCT order_number)                 AS count_orders
    ,SUM(quantity_ordered)                        AS quantity_total
    ,SUM(amount_extended)                         AS amount_revenue
    ,AVG(price_unit)                              AS price_unit_average
    ,COUNT(DISTINCT item_id)                      AS count_unique_items
FROM jde_demo.gold.sales_orders_enriched
WHERE date_order IS NOT NULL
GROUP BY date_order, customer_id, customer_name, order_company;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.product_performance
COMMENT 'Product-level Performance Metrics - Gold'
AS SELECT
    item_id
    ,item_number
    ,MAX(item_description)                        AS item_description
    ,MAX(product_group)                           AS product_group
    ,COUNT(DISTINCT order_number)                  AS count_times_ordered
    ,COUNT(DISTINCT customer_id)                   AS count_unique_customers
    ,SUM(quantity_ordered)                         AS quantity_total_sold
    ,SUM(amount_extended)                          AS amount_revenue
    ,AVG(price_unit)                               AS price_unit_average
    ,MIN(date_order)                               AS date_first_order
    ,MAX(date_order)                               AS date_last_order
FROM jde_demo.gold.sales_orders_enriched
GROUP BY item_id, item_number;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.order_status_distribution
COMMENT 'Order Line Status Distribution - Gold'
AS SELECT
    last_status
    ,next_status
    ,order_type
    ,COUNT(*)                                     AS count_lines
    ,SUM(amount_extended)                         AS amount_total
    ,COUNT(DISTINCT order_number)                  AS count_orders
FROM jde_demo.gold.sales_orders_enriched
GROUP BY last_status, next_status, order_type;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.dq_uniqueness_checks
COMMENT 'Data Quality: Uniqueness validation across Silver tables'
AS
SELECT
    'F4201' AS table_name
    ,'order_number + order_type + order_company' AS natural_key
    ,COUNT(*) AS count_total_rows
    ,COUNT(DISTINCT CONCAT(order_number, '|', order_type, '|', order_company))
        AS count_distinct_keys
    ,COUNT(*) - COUNT(DISTINCT CONCAT(order_number, '|', order_type, '|', order_company))
        AS count_duplicates
    ,CASE
        WHEN COUNT(*) = COUNT(DISTINCT CONCAT(order_number, '|', order_type, '|', order_company))
        THEN 'PASS' ELSE 'FAIL'
     END AS result
FROM jde_demo.silver.f4201_cleansed

UNION ALL

SELECT
    'F4211'
    ,'order_number + order_type + order_company + line_number'
    ,COUNT(*)
    ,COUNT(DISTINCT CONCAT(order_number, '|', order_type, '|',
                           order_company, '|', line_number))
    ,COUNT(*) - COUNT(DISTINCT CONCAT(order_number, '|', order_type, '|',
                                      order_company, '|', line_number))
    ,CASE
        WHEN COUNT(*) = COUNT(DISTINCT CONCAT(order_number, '|', order_type, '|',
                                              order_company, '|', line_number))
        THEN 'PASS' ELSE 'FAIL'
     END
FROM jde_demo.silver.f4211_cleansed

UNION ALL

SELECT
    'F0101'
    ,'address_id'
    ,COUNT(*)
    ,COUNT(DISTINCT address_id)
    ,COUNT(*) - COUNT(DISTINCT address_id)
    ,CASE WHEN COUNT(*) = COUNT(DISTINCT address_id)
          THEN 'PASS' ELSE 'FAIL' END
FROM jde_demo.silver.f0101_cleansed

UNION ALL

SELECT
    'F4101'
    ,'item_id'
    ,COUNT(*)
    ,COUNT(DISTINCT item_id)
    ,COUNT(*) - COUNT(DISTINCT item_id)
    ,CASE WHEN COUNT(*) = COUNT(DISTINCT item_id)
          THEN 'PASS' ELSE 'FAIL' END
FROM jde_demo.silver.f4101_cleansed;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.dq_referential_integrity
COMMENT 'Data Quality: FK references resolve to parent tables'
AS

SELECT
    'F4201' AS child_table
    ,'customer_id -> F0101.address_id' AS fk_relationship
    ,COUNT(*) AS count_total_rows
    ,SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END)
        AS count_orphans
    ,ROUND(100.0 * SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END)
           / COUNT(*), 2) AS percent_orphan
    ,CASE
        WHEN SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END) = 0
        THEN 'PASS' ELSE 'FAIL'
     END AS result
FROM jde_demo.silver.f4201_cleansed h
LEFT JOIN jde_demo.silver.f0101_cleansed ab
    ON h.customer_id = ab.address_id

UNION ALL

SELECT
    'F4211'
    ,'customer_id -> F0101.address_id'
    ,COUNT(*)
    ,SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END)
    ,ROUND(100.0 * SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END)
           / COUNT(*), 2)
    ,CASE
        WHEN SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END) = 0
        THEN 'PASS' ELSE 'FAIL'
     END
FROM jde_demo.silver.f4211_cleansed d
LEFT JOIN jde_demo.silver.f0101_cleansed ab
    ON d.customer_id = ab.address_id

UNION ALL

SELECT
    'F4211'
    ,'order_number -> F4201.order_number'
    ,COUNT(*)
    ,SUM(CASE WHEN h.order_number IS NULL THEN 1 ELSE 0 END)
    ,ROUND(100.0 * SUM(CASE WHEN h.order_number IS NULL THEN 1 ELSE 0 END)
           / COUNT(*), 2)
    ,CASE
        WHEN SUM(CASE WHEN h.order_number IS NULL THEN 1 ELSE 0 END) = 0
        THEN 'PASS' ELSE 'FAIL'
     END
FROM jde_demo.silver.f4211_cleansed d
LEFT JOIN jde_demo.silver.f4201_cleansed h
    ON  d.order_number  = h.order_number
    AND d.order_type    = h.order_type
    AND d.order_company = h.order_company

UNION ALL

SELECT
    'F4211'
    ,'item_id -> F4101.item_id'
    ,COUNT(*)
    ,SUM(CASE WHEN im.item_id IS NULL THEN 1 ELSE 0 END)
    ,ROUND(100.0 * SUM(CASE WHEN im.item_id IS NULL THEN 1 ELSE 0 END)
           / COUNT(*), 2)
    ,CASE
        WHEN SUM(CASE WHEN im.item_id IS NULL THEN 1 ELSE 0 END) = 0
        THEN 'PASS' ELSE 'FAIL'
     END
FROM jde_demo.silver.f4211_cleansed d
LEFT JOIN jde_demo.silver.f4101_cleansed im
    ON d.item_id = im.item_id

UNION ALL

SELECT
    'F03B11'
    ,'customer_id -> F0101.address_id'
    ,COUNT(*)
    ,SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END)
    ,ROUND(100.0 * SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END)
           / COUNT(*), 2)
    ,CASE
        WHEN SUM(CASE WHEN ab.address_id IS NULL THEN 1 ELSE 0 END) = 0
        THEN 'PASS' ELSE 'FAIL'
     END
FROM jde_demo.silver.f03b11_cleansed ar
LEFT JOIN jde_demo.silver.f0101_cleansed ab
    ON ar.customer_id = ab.address_id;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.dq_summary_dashboard
COMMENT 'Data Quality: Overall summary for dashboard'
AS
SELECT
    'Uniqueness' AS check_category
    ,table_name
    ,natural_key AS check_detail
    ,result
    ,count_duplicates AS count_issues
    ,count_total_rows
FROM jde_demo.gold.dq_uniqueness_checks

UNION ALL

SELECT
    'Referential Integrity'
    ,child_table
    ,fk_relationship
    ,result
    ,count_orphans
    ,count_total_rows
FROM jde_demo.gold.dq_referential_integrity;

CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.dq_row_count_reconciliation
COMMENT 'Data Quality: Row count reconciliation Bronze vs Silver'
AS
SELECT
    'F4201' AS table_name
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f4201_raw) AS count_bronze
    ,(SELECT COUNT(*) FROM jde_demo.silver.f4201_cleansed) AS count_silver
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f4201_raw)
     - (SELECT COUNT(*) FROM jde_demo.silver.f4201_cleansed) AS count_dropped
    ,CASE
        WHEN (SELECT COUNT(*) FROM jde_demo.bronze.f4201_raw)
           = (SELECT COUNT(*) FROM jde_demo.silver.f4201_cleansed)
        THEN 'PASS' ELSE 'ROWS DROPPED BY EXPECTATIONS'
     END AS result

UNION ALL

SELECT 'F4211'
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f4211_raw)
    ,(SELECT COUNT(*) FROM jde_demo.silver.f4211_cleansed)
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f4211_raw)
     - (SELECT COUNT(*) FROM jde_demo.silver.f4211_cleansed)
    ,CASE
        WHEN (SELECT COUNT(*) FROM jde_demo.bronze.f4211_raw)
           = (SELECT COUNT(*) FROM jde_demo.silver.f4211_cleansed)
        THEN 'PASS' ELSE 'ROWS DROPPED BY EXPECTATIONS'
     END

UNION ALL

SELECT 'F0101'
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f0101_raw)
    ,(SELECT COUNT(*) FROM jde_demo.silver.f0101_cleansed)
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f0101_raw)
     - (SELECT COUNT(*) FROM jde_demo.silver.f0101_cleansed)
    ,CASE
        WHEN (SELECT COUNT(*) FROM jde_demo.bronze.f0101_raw)
           = (SELECT COUNT(*) FROM jde_demo.silver.f0101_cleansed)
        THEN 'PASS' ELSE 'ROWS DROPPED BY EXPECTATIONS'
     END

UNION ALL

SELECT 'F0116'
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f0116_raw)
    ,(SELECT COUNT(*) FROM jde_demo.silver.f0116_cleansed)
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f0116_raw)
     - (SELECT COUNT(*) FROM jde_demo.silver.f0116_cleansed)
    ,CASE
        WHEN (SELECT COUNT(*) FROM jde_demo.bronze.f0116_raw)
           = (SELECT COUNT(*) FROM jde_demo.silver.f0116_cleansed)
        THEN 'PASS' ELSE 'ROWS DROPPED BY EXPECTATIONS'
     END

UNION ALL

SELECT 'F4101'
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f4101_raw)
    ,(SELECT COUNT(*) FROM jde_demo.silver.f4101_cleansed)
    ,(SELECT COUNT(*) FROM jde_demo.bronze.f4101_raw)
     - (SELECT COUNT(*) FROM jde_demo.silver.f4101_cleansed)
    ,CASE
        WHEN (SELECT COUNT(*) FROM jde_demo.bronze.f4101_raw)
           = (SELECT COUNT(*) FROM jde_demo.silver.f4101_cleansed)
        THEN 'PASS' ELSE 'ROWS DROPPED BY EXPECTATIONS'
     END

UNION ALL

SELECT 'F03B11'
,(SELECT COUNT(*) FROM jde_demo.bronze.f03b11_raw)
,(SELECT COUNT(*) FROM jde_demo.silver.f03b11_cleansed)
,(SELECT COUNT(*) FROM jde_demo.bronze.f03b11_raw)
    - (SELECT COUNT(*) FROM jde_demo.silver.f03b11_cleansed)
,CASE
    WHEN (SELECT COUNT(*) FROM jde_demo.bronze.f03b11_raw)
        = (SELECT COUNT(*) FROM jde_demo.silver.f03b11_cleansed)
    THEN 'PASS' ELSE 'ROWS DROPPED BY EXPECTATIONS'
    END
;

CREATE OR REFRESH MATERIALIZED VIEW jde_demo.gold.dim_customer AS
SELECT
    ab.address_id              AS customer_id,
    ab.customer_name,
    ac.address_line_1,
    ac.city,
    ac.state_code,
    ac.postal_code,
    ac.country_code,
    ac.phone_number,
    ab.tax_id,
    ab.address_type,
    COUNT(DISTINCT so.order_number)  AS lifetime_orders,
    SUM(so.amount_extended)          AS lifetime_revenue,
    MIN(so.date_order)               AS first_order_date,
    MAX(so.date_order)               AS last_order_date
FROM jde_demo.silver.f0101_cleansed ab
LEFT JOIN jde_demo.silver.F0116_cleansed ac ON ac.address_id = ab.address_id
LEFT JOIN jde_demo.gold.sales_orders_enriched so ON ab.address_id = so.customer_id
GROUP BY
    ab.address_id,
    ab.customer_name,
    ac.address_line_1,
    ac.city,
    ac.state_code,
    ac.postal_code,
    ac.country_code,
    ac.phone_number,
    ab.tax_id,
    ab.address_type
;

-- Use fully qualified name consistently
CREATE OR REFRESH STREAMING TABLE jde_demo.gold.dim_customer_scd2;

CREATE FLOW dim_customer_scd2_flow AS 
  AUTO CDC INTO jde_demo.gold.dim_customer_scd2
  FROM STREAM(jde_demo.silver.f0101_cleansed)
  KEYS (address_id)
  SEQUENCE BY silver_processed_at
  STORED AS SCD TYPE 2;