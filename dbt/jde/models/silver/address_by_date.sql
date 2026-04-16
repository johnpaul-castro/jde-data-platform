{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['address_id']},
      {'columns': ['address_id', 'effective_date_raw']}
    ]
) }}

SELECT
    TRIM("ALAN8")::INTEGER       AS address_id,
    TRIM("ALEFFT")               AS effective_date_raw,
    TRIM("ALADDJ")               AS address_date_raw,
    TRIM("ALADD1")               AS address_line_1,
    TRIM("ALADD2")               AS address_line_2,
    TRIM("ALCTRY")               AS country,
    TRIM("ALCTY1")               AS city,
    TRIM("ALADDS")               AS state,
    TRIM("ALADDZ")               AS zip_code,
    TRIM("ALPH1")                AS phone,
    raw_synced_at
FROM bronze."F0116"
WHERE "ALAN8" IS NOT NULL
