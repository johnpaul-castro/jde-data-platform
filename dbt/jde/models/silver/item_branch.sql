{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['item_id']},
      {'columns': ['business_unit']},
      {'columns': ['item_id', 'business_unit'], 'unique': true}
    ]
) }}
WITH source AS (
    SELECT
        TRIM("IBITM")::INTEGER       AS item_id,
        TRIM("IBMCU")                AS business_unit,
        TRIM("IBLOTN")               AS lot_number,
        TRIM("IBPRGR")               AS price_group,
        TRIM("IBPRGF")               AS price_group_from,
        {{ jde_date('"IBUPMJ"') }}   AS date_updated,
        TRIM("IBQOH")::NUMERIC       AS quantity_on_hand,
        TRIM("IBQANO")::NUMERIC      AS quantity_on_order,
        TRIM("IBCSTO")::NUMERIC      AS cost_average,
        TRIM("IBSRP1")::NUMERIC      AS price_list,
        raw_synced_at
    FROM bronze."F4102"
    WHERE "IBITM" IS NOT NULL
),
deduped AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY item_id, business_unit
            ORDER BY date_updated DESC NULLS LAST, raw_synced_at DESC
        ) AS rn
    FROM source
)
SELECT
    item_id, business_unit, lot_number, price_group,
    price_group_from, date_updated, quantity_on_hand,
    quantity_on_order, cost_average, price_list, raw_synced_at
FROM deduped
WHERE rn = 1
