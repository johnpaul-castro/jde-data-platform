{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['order_id'], 'unique': true},
      {'columns': ['vendor_id']},
      {'columns': ['business_unit']},
      {'columns': ['order_type']}
    ]
) }}

SELECT
    -- Keys
    TRIM("PHDOCO")::INTEGER      AS order_id,
    TRIM("PHKCOO")               AS company,

    -- Attributes
    TRIM("PHDCTO")               AS order_type,
    TRIM("PHAN8")::INTEGER       AS vendor_id,
    TRIM("PHMCU")                AS business_unit,
    TRIM("PHVR01")               AS reference,
    TRIM("PHCR")                 AS currency_code,
    TRIM("PHUSER")               AS updated_by,

    -- Dates
    {{ jde_date('"PHTRDJ"') }}   AS date_transaction,
    {{ jde_date('"PHDRQJ"') }}   AS date_requested,
    {{ jde_date('"PHPDDJ"') }}   AS date_promised,
    {{ jde_date('"PHUPMJ"') }}   AS date_updated,

    -- Amounts
    TRIM("PHCRR")::NUMERIC       AS exchange_rate,
    TRIM("PHTOTL")::NUMERIC      AS order_total,

    raw_synced_at
FROM bronze."F4301"
WHERE "PHDOCO" IS NOT NULL
