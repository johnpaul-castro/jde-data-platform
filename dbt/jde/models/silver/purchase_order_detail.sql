{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['order_id']},
      {'columns': ['item_id']},
      {'columns': ['order_id', 'line_number'], 'unique': true},
      {'columns': ['next_status']}
    ]
) }}

SELECT
    -- Keys
    TRIM("PDDOCO")::INTEGER      AS order_id,
    TRIM("PDLNID")::NUMERIC      AS line_number,
    TRIM("PDITM")::INTEGER       AS item_id,

    -- Attributes
    TRIM("PDDCTO")               AS order_type,
    TRIM("PDLITM")               AS item_number,
    TRIM("PDDSC1")               AS item_description,
    TRIM("PDMCU")                AS business_unit,
    TRIM("PDUOM")                AS unit_of_measure,
    TRIM("PDNXTR")               AS next_status,
    TRIM("PDLTTR")               AS last_status,

    -- Dates
    {{ jde_date('"PDUPMJ"') }}   AS date_updated,

    -- Quantities
    TRIM("PDUREC")::NUMERIC      AS quantity_received,
    TRIM("PDAREC")::NUMERIC      AS quantity_receipted,

    -- Costs
    TRIM("PDPRRC")::NUMERIC      AS unit_cost,
    TRIM("PDAEXP")::NUMERIC      AS extended_amount,

    raw_synced_at
FROM bronze."F4311"
WHERE "PDDOCO" IS NOT NULL
