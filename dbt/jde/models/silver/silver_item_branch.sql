{{ config(schema='silver', materialized='view') }}

SELECT
    TRIM("IBMCU")                AS business_unit,
    TRIM("IBITM")::INTEGER       AS item_id,
    TRIM("IBLOTN")               AS lot_number,
    TRIM("IBPRGR")               AS price_group,
    TRIM("IBPRGF")               AS price_group_from,
    TRIM("IBQOH")::NUMERIC       AS quantity_on_hand,
    TRIM("IBQANO")::NUMERIC      AS quantity_on_order,
    TRIM("IBCSTO")::NUMERIC      AS cost_average,
    TRIM("IBSRP1")::NUMERIC      AS price_list,
    TRIM("IBUPMJ")               AS updated_date_raw,
    raw_synced_at
FROM bronze."F4102"
WHERE "IBITM" IS NOT NULL
