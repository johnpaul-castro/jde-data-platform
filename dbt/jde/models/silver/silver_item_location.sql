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
    TRIM("LIITM")::INTEGER                                    AS item_id,
    TRIM("LIMCU")                                             AS business_unit,
    TRIM("LILOCN")                                            AS location,
    TRIM("LILOTN")                                            AS lot_number,
    TRIM("LIPQOH")::NUMERIC                                   AS quantity_on_hand,
    TRIM("LIPQCO")::NUMERIC                                   AS quantity_committed,
    TRIM("LIPQAV")::NUMERIC                                   AS quantity_available,
    TRIM("LIPQOH2")::NUMERIC                                  AS quantity_on_hand_2,
    TRIM("LICOMM")                                            AS quantity_on_order_note,
    TRIM("LIEXDJ")                                            AS expiration_date_raw,
    TRIM("LIRCDJ")                                            AS received_date_raw,
    TRIM("LIUPMJ")                                            AS updated_date_raw,
    raw_synced_at
FROM bronze."F41021"
WHERE "LIITM" IS NOT NULL
