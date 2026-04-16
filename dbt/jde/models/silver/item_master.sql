{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['item_id'], 'unique': true},
      {'columns': ['item_number']},
      {'columns': ['gl_class']},
      {'columns': ['product_group']}
    ]
) }}

SELECT
    -- Keys
    TRIM("IMITM")::INTEGER       AS item_id,
    TRIM("IMLITM")               AS item_number,
    TRIM("IMAITM")               AS item_number_alt,

    -- Attributes
    TRIM("IMDSC1")               AS item_description,
    TRIM("IMDSC2")               AS item_description_2,
    TRIM("IMUOM")                AS unit_of_measure,
    TRIM("IMSTKT")               AS stocking_type,
    TRIM("IMGLPT")               AS gl_class,
    TRIM("IMPDGR")               AS product_group,
    TRIM("IMCIFM")               AS cost_method,

    -- Dates
    {{ jde_date('"IMUPMJ"') }}   AS date_updated,

    raw_synced_at
FROM bronze."F4101"
WHERE "IMITM" IS NOT NULL
