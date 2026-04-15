{{ config(schema='silver', materialized='view') }}

SELECT
    TRIM("LIITM")::INTEGER       AS item_id,
    TRIM("LIMCU")                AS business_unit,
    TRIM("LILOCN")               AS location,
    TRIM("LILOTN")               AS lot_number,
    TRIM("LIPQOH")::NUMERIC      AS quantity_on_hand,
    TRIM("LIPQCO")::NUMERIC      AS quantity_committed,
    TRIM("LIPQAV")::NUMERIC      AS quantity_available,
    TRIM("LIPQOH2")::NUMERIC     AS quantity_on_hand_2,
    TRIM("LICOMM")::NUMERIC      AS quantity_on_order,
    TRIM("LIEXDJ")               AS expiration_date_raw,
    TRIM("LIRCDJ")               AS received_date_raw,
    TRIM("LIUPMJ")               AS updated_date_raw,
    raw_synced_at
FROM bronze."F41021"
WHERE "LIITM" IS NOT NULL
