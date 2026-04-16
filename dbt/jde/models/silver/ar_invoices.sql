{{ config(
    schema='silver',
    materialized='table',
    indexes=[
      {'columns': ['document_id'], 'unique': true},
      {'columns': ['customer_id']},
      {'columns': ['pay_status']},
      {'columns': ['post_status']}
    ]
) }}

SELECT
    -- Keys
    TRIM("RPDOC")::INTEGER       AS document_id,
    TRIM("RPAN8")::INTEGER       AS customer_id,
    TRIM("RPKCO")                AS company,

    -- Attributes
    TRIM("RPDCT")                AS document_type,
    TRIM("RPCRCD")               AS currency_code,
    TRIM("RPPOST")               AS post_status,
    TRIM("RPST")                 AS pay_status,
    TRIM("RPRMK")                AS remark,

    -- Dates
    {{ jde_date('"RPDGJ"') }}    AS date_gl,
    {{ jde_date('"RPDDJ"') }}    AS date_due,
    {{ jde_date('"RPDIVJ"') }}   AS date_invoice,
    {{ jde_date('"RPUPMJ"') }}   AS date_updated,

    -- Amounts
    TRIM("RPAG")::NUMERIC        AS amount_gross,
    TRIM("RPAOD")::NUMERIC       AS amount_discount,
    TRIM("RPAAP")::NUMERIC       AS amount_open,

    raw_synced_at
FROM bronze."F03B11"
WHERE "RPDOC" IS NOT NULL
