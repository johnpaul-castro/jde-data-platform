{{ config(schema='silver', materialized='view') }}

SELECT
    TRIM("IMITM")::INTEGER       AS item_id,
    TRIM("IMLITM")               AS item_number,
    TRIM("IMAITM")               AS item_number_alt,
    TRIM("IMDSC1")               AS item_description,
    TRIM("IMDSC2")               AS item_description_2,
    TRIM("IMUOM")                AS unit_of_measure,
    TRIM("IMSTKT")               AS stocking_type,
    TRIM("IMGLPT")               AS gl_class,
    TRIM("IMPDGR")               AS product_group,
    TRIM("IMCIFM")               AS cost_method,
    TRIM("IMUPMJ")               AS updated_date_raw,
    raw_synced_at
FROM bronze."F4101"
WHERE "IMITM" IS NOT NULL
