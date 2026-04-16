{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['address_id']},
      {'columns': ['address_id', 'date_effective']}
    ]
) }}

SELECT
    -- Keys
    TRIM("ALAN8")::INTEGER       AS address_id,

    -- Attributes
    TRIM("ALADD1")               AS address_line_1,
    TRIM("ALADD2")               AS address_line_2,
    TRIM("ALCTRY")               AS country,
    TRIM("ALCTY1")               AS city,
    TRIM("ALADDS")               AS state,
    TRIM("ALADDZ")               AS zip_code,
    TRIM("ALPH1")                AS phone,

    -- Dates
    {{ jde_date('"ALEFFT"') }}   AS date_effective,
    {{ jde_date('"ALADDJ"') }}   AS date_address,

    raw_synced_at
FROM bronze."F0116"
WHERE "ALAN8" IS NOT NULL
