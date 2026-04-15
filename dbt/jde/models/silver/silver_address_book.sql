{{ config(schema='silver', materialized='view') }}

SELECT
    TRIM("ABAN8")::INTEGER       AS address_id,
    TRIM("ABALKY")               AS address_key,
    TRIM("ABAT1")                AS address_type,
    TRIM("ABALPH")               AS address_name,
    TRIM("ABDC")                 AS description,
    TRIM("ABTAX")                AS tax_id,
    TRIM("ABSIC")                AS sic_code,
    TRIM("ABCM")                 AS currency_code,
    TRIM("ABCR")                 AS credit_rating,
    TRIM("ABUSER")               AS updated_by,
    raw_synced_at
FROM bronze."F0101"
WHERE "ABAN8" IS NOT NULL
