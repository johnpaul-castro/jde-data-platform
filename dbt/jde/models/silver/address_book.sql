{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['address_id'], 'unique': true},
      {'columns': ['address_type']}
    ]
) }}

SELECT
    -- Keys
    TRIM("ABAN8")::INTEGER       AS address_id,
    TRIM("ABALKY")               AS address_key,

    -- Attributes
    TRIM("ABAT1")                AS address_type,
    TRIM("ABALPH")               AS address_name,
    TRIM("ABDC")                 AS description,
    TRIM("ABTAX")                AS tax_id,
    TRIM("ABSIC")                AS sic_code,
    TRIM("ABCM")                 AS currency_code,
    TRIM("ABCR")                 AS credit_rating,
    TRIM("ABUSER")               AS updated_by,

    -- Dates
    {{ jde_date('"ABUPMJ"') }}   AS date_updated,

    raw_synced_at
FROM bronze."F0101"
WHERE "ABAN8" IS NOT NULL
