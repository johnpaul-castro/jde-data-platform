{{ config(schema='silver', materialized='view') }}

SELECT
    TRIM("SHDOCO")::INTEGER      AS order_id,
    TRIM("SHDCTO")               AS order_type,
    TRIM("SHKCOO")               AS company,
    TRIM("SHDRQJ")               AS date_requested_raw,
    TRIM("SHTRDJ")               AS date_transaction_raw,
    TRIM("SHPDDJ")               AS date_promised_raw,
    TRIM("SHSHAN8")::INTEGER     AS sold_to_id,
    TRIM("SHSDAN8")::INTEGER     AS ship_to_id,
    TRIM("SHMCU")                AS business_unit,
    TRIM("SHVR01")               AS reference,
    TRIM("SHCR")                 AS currency_code,
    TRIM("SHCRR")::NUMERIC       AS exchange_rate,
    TRIM("SHTOTL")::NUMERIC      AS order_total,
    TRIM("SHUSER")               AS updated_by,
    TRIM("SHUPMJ")               AS updated_date_raw,
    raw_synced_at
FROM bronze."F4201"
WHERE "SHDOCO" IS NOT NULL
