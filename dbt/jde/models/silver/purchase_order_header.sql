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
    TRIM("PHDOCO")::INTEGER      AS order_id,
    TRIM("PHDCTO")               AS order_type,
    TRIM("PHKCOO")               AS company,
    TRIM("PHTRDJ")               AS date_transaction_raw,
    TRIM("PHDRQJ")               AS date_requested_raw,
    TRIM("PHPDDJ")               AS date_promised_raw,
    TRIM("PHAN8")::INTEGER       AS vendor_id,
    TRIM("PHMCU")                AS business_unit,
    TRIM("PHVR01")               AS reference,
    TRIM("PHCR")                 AS currency_code,
    TRIM("PHCRR")::NUMERIC       AS exchange_rate,
    TRIM("PHTOTL")::NUMERIC      AS order_total,
    TRIM("PHUSER")               AS updated_by,
    TRIM("PHUPMJ")               AS updated_date_raw,
    raw_synced_at
FROM bronze."F4301"
WHERE "PHDOCO" IS NOT NULL
