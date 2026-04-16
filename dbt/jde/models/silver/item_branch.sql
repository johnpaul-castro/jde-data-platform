{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['item_id']},
      {'columns': ['business_unit']},
      {'columns': ['item_id', 'business_unit'], 'unique': true}
    ]
) }}

SELECT
    -- Keys
    TRIM("IBITM")::INTEGER       AS item_id,
    TRIM("IBMCU")                AS business_unit,

    -- Attributes
    TRIM("IBLOTN")               AS lot_number,
    TRIM("IBPRGR")               AS price_group,
    TRIM("IBPRGF")               AS price_group_from,

    -- Dates
    {{ jde_date('"IBUPMJ"') }}   AS date_updated,

    -- Quantities
    TRIM("IBQOH")::NUMERIC       AS quantity_on_hand,
    TRIM("IBQANO")::NUMERIC      AS quantity_on_order,

    -- Costs
    TRIM("IBCSTO")::NUMERIC      AS cost_average,

    -- Prices
    TRIM("IBSRP1")::NUMERIC      AS price_list,

    raw_synced_at
FROM bronze."F4102"
WHERE "IBITM" IS NOT NULL
