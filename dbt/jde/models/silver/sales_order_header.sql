{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['order_id'], 'unique': true},
      {'columns': ['sold_to_id']},
      {'columns': ['ship_to_id']},
      {'columns': ['business_unit']},
      {'columns': ['order_type']}
    ]
) }}

SELECT
    -- Keys
    TRIM("SHDOCO")::INTEGER      AS order_id,
    TRIM("SHKCOO")               AS company,

    -- Attributes
    TRIM("SHDCTO")               AS order_type,
    TRIM("SHAN8")::INTEGER     AS sold_to_id,
    TRIM("SHSHAN")::INTEGER     AS ship_to_id,
    TRIM("SHMCU")                AS business_unit,
    TRIM("SHVR01")               AS reference,
    TRIM("SHCR")                 AS currency_code,
    TRIM("SHUSER")               AS updated_by,

    -- Dates
    {{ jde_date('"SHDRQJ"') }}   AS date_requested,
    {{ jde_date('"SHTRDJ"') }}   AS date_transaction,
    {{ jde_date('"SHPDDJ"') }}   AS date_promised,
    {{ jde_date('"SHUPMJ"') }}   AS date_updated,

    -- Amounts
    TRIM("SHCRR")::NUMERIC       AS exchange_rate,
    TRIM("SHOTOT")::NUMERIC      AS order_total,

    raw_synced_at
FROM bronze."F4201"
WHERE "SHDOCO" IS NOT NULL
