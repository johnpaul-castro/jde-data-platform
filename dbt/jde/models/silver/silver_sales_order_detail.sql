{{ config(schema='silver', materialized='view') }}

SELECT
    TRIM("SDDOCO")::INTEGER      AS order_id,
    TRIM("SDDCTO")               AS order_type,
    TRIM("SDLNID")::NUMERIC      AS line_number,
    TRIM("SDITM")::INTEGER       AS item_id,
    TRIM("SDLITM")               AS item_number,
    TRIM("SDDSC1")               AS item_description,
    TRIM("SDMCU")                AS business_unit,
    TRIM("SDUOM")                AS unit_of_measure,
    TRIM("SDSOQS")::NUMERIC      AS quantity_ordered,
    TRIM("SDSHPN")::NUMERIC      AS quantity_shipped,
    TRIM("SDUPRC")::NUMERIC      AS unit_price,
    TRIM("SDAEXP")::NUMERIC      AS extended_amount,
    TRIM("SDNXTR")               AS next_status,
    TRIM("SDLTTR")               AS last_status,
    TRIM("SDUPMJ")               AS updated_date_raw,
    raw_synced_at
FROM bronze."F4211"
WHERE "SDDOCO" IS NOT NULL
