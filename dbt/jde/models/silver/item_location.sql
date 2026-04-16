{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['item_id']},
      {'columns': ['business_unit']},
      {'columns': ['location']},
      {'columns': ['item_id', 'business_unit', 'location']}
    ]
) }}

SELECT
    -- Keys
    TRIM("LIITM")::INTEGER       AS item_id,
    TRIM("LIMCU")                AS business_unit,
    TRIM("LILOCN")               AS location,
    TRIM("LILOTN")               AS lot_number,

    -- Attributes
    TRIM("LICOMM")               AS on_order_note,

    -- Dates
    {{ jde_date('"LIEXDJ"') }}   AS date_expiration,
    {{ jde_date('"LIRCDJ"') }}   AS date_received,
    {{ jde_date('"LIUPMJ"') }}   AS date_updated,

    -- Quantities
    TRIM("LIPQOH")::NUMERIC      AS quantity_on_hand,
    TRIM("LIPQCO")::NUMERIC      AS quantity_committed,
    TRIM("LIPQAV")::NUMERIC      AS quantity_available,
    TRIM("LIPQOH2")::NUMERIC     AS quantity_on_hand_2,

    raw_synced_at
FROM bronze."F41021"
WHERE "LIITM" IS NOT NULL
