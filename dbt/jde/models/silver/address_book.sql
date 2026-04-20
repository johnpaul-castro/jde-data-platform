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
),
addresses AS (
    SELECT
        TRIM("ALAN8")::INTEGER       AS address_id,
        TRIM("ALADD1")               AS address_line_1,
        TRIM("ALADD2")               AS address_line_2,
        TRIM("ALCTY1")               AS city,
        TRIM("ALADDS")               AS state,
        TRIM("ALADDZ")               AS zip,
        TRIM("ALCTRY")               AS country,
        TRIM("ALPH1")                AS phone
    FROM bronze."F0116"
    WHERE "ALAN8" IS NOT NULL
)
SELECT
    d.address_id, d.address_key, d.address_type, d.address_name,
    d.description, d.tax_id, d.sic_code, d.credit_message,
    d.updated_by, d.date_updated, d.raw_synced_at,
    a.address_line_1, a.address_line_2, a.city, a.state, a.zip, a.country, a.phone
FROM deduped d
LEFT JOIN addresses a ON d.address_id = a.address_id
WHERE d.rn = 1
