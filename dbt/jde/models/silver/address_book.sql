{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['address_id'], 'unique': true},
      {'columns': ['address_type']}
    ]
) }}
WITH source AS (
    SELECT
        TRIM("ABAN8")::INTEGER       AS address_id,
        TRIM("ABALKY")               AS address_key,
        TRIM("ABAT1")                AS address_type,
        TRIM("ABALPH")               AS address_name,
        TRIM("ABDC")                 AS description,
        TRIM("ABTAX")                AS tax_id,
        TRIM("ABSIC")                AS sic_code,
        TRIM("ABCM")                 AS credit_message,
        TRIM("ABUSER")               AS updated_by,
        {{ jde_date('"ABUPMJ"') }}   AS date_updated,
        raw_synced_at
    FROM bronze."F0101"
    WHERE "ABAN8" IS NOT NULL
),
deduped AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY address_id
            ORDER BY date_updated DESC NULLS LAST, raw_synced_at DESC
        ) AS rn
    FROM source
)
SELECT
    address_id, address_key, address_type, address_name,
    description, tax_id, sic_code, credit_message,
    updated_by, date_updated, raw_synced_at
FROM deduped
WHERE rn = 1
