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
    TRIM("SDDOCO")::INTEGER      AS order_id,
    TRIM("SDLNID")::NUMERIC      AS line_number,
    TRIM("SDITM")::INTEGER       AS item_id,

    -- Attributes
    TRIM("SDDCTO")               AS order_type,
    TRIM("SDLITM")               AS item_number,
    TRIM("SDDSC1")               AS item_description,
    TRIM("SDMCU")                AS business_unit,
    TRIM("SDUOM")                AS unit_of_measure,
    TRIM("SDNXTR")               AS next_status,
    TRIM("SDLTTR")               AS last_status,

    -- Dates
    {{ jde_date('"SDUPMJ"') }}   AS date_updated,

    -- Quantities
    TRIM("SDSOQS")::NUMERIC      AS quantity_ordered,
    TRIM("SDSHPN")::NUMERIC      AS quantity_shipped,

    -- Prices
    TRIM("SDUPRC")::NUMERIC      AS unit_price,
    TRIM("SDAEXP")::NUMERIC      AS extended_amount,

    raw_synced_at
FROM bronze."F4211"
WHERE "SDDOCO" IS NOT NULL
