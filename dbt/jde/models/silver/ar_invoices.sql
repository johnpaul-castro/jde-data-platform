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
    TRIM("RPDOC")::INTEGER       AS document_id,
    TRIM("RPDCT")                AS document_type,
    TRIM("RPKCO")                AS company,
    TRIM("RPAN8")::INTEGER       AS customer_id,
    TRIM("RPDGJ")                AS date_gl_raw,
    TRIM("RPDDJ")                AS date_due_raw,
    TRIM("RPDIVJ")               AS date_invoice_raw,
    TRIM("RPCRCD")               AS currency_code,
    TRIM("RPAAP")::NUMERIC       AS amount_open,
    TRIM("RPAG")::NUMERIC        AS amount_gross,
    TRIM("RPAOD")::NUMERIC       AS amount_discount,
    TRIM("RPPOST")               AS post_status,
    TRIM("RPST")                 AS pay_status,
    TRIM("RPRMK")                AS remark,
    TRIM("RPUPMJ")               AS updated_date_raw,
    raw_synced_at
FROM bronze."F03B11"
WHERE "RPDOC" IS NOT NULL
