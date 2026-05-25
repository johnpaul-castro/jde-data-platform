CREATE OR REFRESH MATERIALIZED VIEW jde_demo.silver.f4201_cleansed (

    -- COMPLETENESS
    CONSTRAINT completeness_order_number
        EXPECT (order_number IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_order_company
        EXPECT (order_company IS NOT NULL AND order_company <> '')
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_customer_id
        EXPECT (customer_id IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_ship_to_id
        EXPECT (ship_to_id IS NOT NULL)
        

    ,CONSTRAINT completeness_business_unit
        EXPECT (business_unit IS NOT NULL AND business_unit <> '')
        

    -- VALIDITY
    ,CONSTRAINT validity_order_number_positive
        EXPECT (order_number > 0)
        ON VIOLATION DROP ROW

    ,CONSTRAINT validity_customer_id_range
        EXPECT (customer_id > 0 AND customer_id < 99999999)
        ON VIOLATION FAIL UPDATE

    ,CONSTRAINT validity_ship_to_id_range
        EXPECT (ship_to_id > 0 AND ship_to_id < 99999999)
        

    ,CONSTRAINT validity_order_type_known
        EXPECT (order_type IN ('SO','WO','ST','OT','SQ'))
        

    ,CONSTRAINT validity_currency_code
        EXPECT (currency_code IS NULL
                OR currency_code IN ('USD','EUR','GBP','CAD','JPY',''))
        

    ,CONSTRAINT validity_amount_order_non_negative
        EXPECT (amount_order IS NULL OR amount_order >= 0)
        

    ,CONSTRAINT validity_currency_rate
        EXPECT (currency_rate IS NULL
                OR (currency_rate > 0 AND currency_rate < 1000))
        

    -- TIMELINESS
    ,CONSTRAINT timeliness_date_order_not_future
        EXPECT (date_order IS NULL OR date_order <= CURRENT_DATE())
        

    ,CONSTRAINT timeliness_date_order_not_ancient
        EXPECT (date_order IS NULL OR date_order >= DATE '2000-01-01')
        

    ,CONSTRAINT timeliness_date_requested_reasonable
        EXPECT (date_requested IS NULL OR date_requested >= DATE '2000-01-01')
        
)
COMMENT 'Cleansed JDE F4201 Sales Order Header - Silver (SeyTec Naming Convention)'
AS SELECT
    CAST(SHDOCO AS INT)                AS order_number
    ,TRIM(SHDCTO)                      AS order_type
    ,TRIM(SHKCOO)                      AS order_company

    -- JDE Julian date conversions (prefix-first per SeyTec standard)
    ,CASE
        WHEN CAST(SHDRQJ AS INT) > 0 THEN
            DATE_ADD(
                MAKE_DATE(1900 + FLOOR(CAST(SHDRQJ AS INT) / 1000), 1, 1)
                ,CAST(SHDRQJ AS INT) % 1000 - 1
            )
        ELSE NULL
     END                               AS date_requested

    ,CASE
        WHEN CAST(SHTRDJ AS INT) > 0 THEN
            DATE_ADD(
                MAKE_DATE(1900 + FLOOR(CAST(SHTRDJ AS INT) / 1000), 1, 1)
                ,CAST(SHTRDJ AS INT) % 1000 - 1
            )
        ELSE NULL
     END                               AS date_order

    ,CASE
        WHEN CAST(SHPDDJ AS INT) > 0 THEN
            DATE_ADD(
                MAKE_DATE(1900 + FLOOR(CAST(SHPDDJ AS INT) / 1000), 1, 1)
                ,CAST(SHPDDJ AS INT) % 1000 - 1
            )
        ELSE NULL
     END                               AS date_promised

    ,CAST(SHAN8 AS INT)                AS customer_id
    ,CAST(SHSHAN AS INT)               AS ship_to_id
    ,TRIM(SHMCU)                       AS business_unit
    ,TRIM(SHVR01)                      AS reference
    ,TRIM(SHCR)                        AS currency_code
    ,CAST(SHCRR AS DECIMAL(15,7))      AS currency_rate
    ,CAST(SHOTOT AS DECIMAL(15,2))     AS amount_order
    ,TRIM(SHUSER)                      AS updated_by_user
    ,CAST(SHUPMJ AS INT)               AS date_updated_julian
    ,current_timestamp()               AS silver_processed_at
FROM jde_demo.bronze.f4201_raw;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.silver.f4211_cleansed (

    -- COMPLETENESS
    CONSTRAINT completeness_order_number
        EXPECT (order_number IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_line_number
        EXPECT (line_number IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_item_id
        EXPECT (item_id IS NOT NULL)
        

    ,CONSTRAINT completeness_quantity_ordered
        EXPECT (quantity_ordered IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_customer_id
        EXPECT (customer_id IS NOT NULL)
        

    -- VALIDITY
    ,CONSTRAINT validity_line_number_positive
        EXPECT (line_number > 0)
        ON VIOLATION DROP ROW

    ,CONSTRAINT validity_quantity_ordered_positive
        EXPECT (quantity_ordered > 0)
        

    ,CONSTRAINT validity_price_unit_non_negative
        EXPECT (price_unit IS NULL OR price_unit >= 0)
        

    ,CONSTRAINT validity_amount_extended_non_negative
        EXPECT (amount_extended IS NULL OR amount_extended >= 0)
        

    ,CONSTRAINT validity_next_status_known
        EXPECT (next_status IN ('520','560','620','999',''))
        

    ,CONSTRAINT validity_last_status_known
        EXPECT (last_status IN ('520','560','620','999',''))
        

    ,CONSTRAINT validity_item_id_range
        EXPECT (item_id IS NULL
                OR (item_id > 0 AND item_id < 99999999))
        

    -- CONSISTENCY
    ,CONSTRAINT consistency_extended_vs_unit_price
        EXPECT (
            amount_extended IS NULL
            OR price_unit IS NULL
            OR quantity_ordered IS NULL
            OR ABS(amount_extended - (quantity_ordered * price_unit)) < 0.02
        )
        

    ,CONSTRAINT consistency_status_progression
        EXPECT (
            CAST(next_status AS INT) >= CAST(last_status AS INT)
            OR next_status = '' OR last_status = ''
        )
        

    -- TIMELINESS
    ,CONSTRAINT timeliness_date_updated_not_future
        EXPECT (date_updated_julian IS NULL
                OR date_updated_julian <= 126365)
        
)
COMMENT 'Cleansed JDE F4211 Sales Order Detail - Silver (SeyTec Naming Convention)'
AS SELECT
    CAST(SDDOCO AS INT)                AS order_number
    ,TRIM(SDDCTO)                      AS order_type
    ,TRIM(SDKCOO)                      AS order_company
    ,CAST(SDLNID AS DECIMAL(6,0))      AS line_number
    ,CAST(SDAN8 AS INT)                AS customer_id
    ,CAST(SDSHAN AS INT)               AS ship_to_id
    ,CAST(SDITM AS INT)                AS item_id
    ,TRIM(SDLITM)                      AS item_number
    ,TRIM(SDDSC1)                      AS item_description
    ,TRIM(SDMCU)                       AS business_unit
    ,TRIM(SDUOM)                       AS unit_of_measure
    ,CAST(SDSOQS AS DECIMAL(15,4))     AS quantity_ordered
    ,CAST(SDSHPN AS INT)               AS shipment_number
    ,CAST(SDUPRC AS DECIMAL(15,4))     AS price_unit
    ,CAST(SDAEXP AS DECIMAL(15,2))     AS amount_extended
    ,TRIM(SDNXTR)                      AS next_status
    ,TRIM(SDLTTR)                      AS last_status
    ,CAST(SDUPMJ AS INT)               AS date_updated_julian
    ,current_timestamp()               AS silver_processed_at
FROM jde_demo.bronze.f4211_raw;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.silver.f0101_cleansed (

    CONSTRAINT completeness_address_id
        EXPECT (address_id IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_customer_name
        EXPECT (customer_name IS NOT NULL AND customer_name <> '')
        

    ,CONSTRAINT validity_address_id_positive
        EXPECT (address_id > 0)
        ON VIOLATION DROP ROW

    ,CONSTRAINT validity_address_type_known
        EXPECT (address_type IN ('C','V','E',''))
        

    ,CONSTRAINT completeness_address_type
        EXPECT (address_type IS NOT NULL AND address_type <> '')
        
)
COMMENT 'Cleansed JDE F0101 Address Book - Silver (SeyTec Naming Convention)'
AS SELECT
    CAST(ABAN8 AS INT)                 AS address_id
    ,TRIM(ABALKY)                      AS address_key
    ,TRIM(ABAT1)                       AS address_type
    ,TRIM(ABALPH)                      AS customer_name
    ,TRIM(ABDC)                        AS description
    ,TRIM(ABTAX)                       AS tax_id
    ,TRIM(ABSIC)                       AS sic_code
    ,TRIM(ABCM)                        AS credit_message
    ,TRIM(ABCR)                        AS credit_rating
    ,CAST(ABUPMJ AS INT)               AS date_updated_julian
    ,TRIM(ABUSER)                      AS updated_by_user
    ,current_timestamp()               AS silver_processed_at
FROM jde_demo.bronze.f0101_raw;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.silver.f0116_cleansed (

    CONSTRAINT completeness_address_id
        EXPECT (address_id IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_address_line_1
        EXPECT (address_line_1 IS NOT NULL AND address_line_1 <> '')
        

    ,CONSTRAINT validity_address_id_positive
        EXPECT (address_id > 0)
        ON VIOLATION DROP ROW

    ,CONSTRAINT validity_postal_code_populated
        EXPECT (postal_code IS NOT NULL AND postal_code <> '')
        
)
COMMENT 'Cleansed JDE F0116 Address by Date - Silver (SeyTec Naming Convention)'
AS SELECT
    CAST(ALAN8 AS INT)                 AS address_id
    ,TRIM(ALEFFT)                      AS date_effective
    ,CAST(ALADDJ AS INT)               AS date_address_julian
    ,TRIM(ALADD1)                      AS address_line_1
    ,TRIM(ALADD2)                      AS address_line_2
    ,TRIM(ALCTRY)                      AS country_code
    ,TRIM(ALCTY1)                      AS city
    ,TRIM(ALADDS)                      AS state_code
    ,TRIM(ALADDZ)                      AS postal_code
    ,TRIM(ALPH1)                       AS phone_number
    ,current_timestamp()               AS silver_processed_at
FROM jde_demo.bronze.f0116_raw;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.silver.f4101_cleansed (

    CONSTRAINT completeness_item_id
        EXPECT (item_id IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_item_number
        EXPECT (item_number IS NOT NULL AND item_number <> '')
        

    ,CONSTRAINT completeness_item_description
        EXPECT (item_description IS NOT NULL AND item_description <> '')
        

    ,CONSTRAINT validity_item_id_positive
        EXPECT (item_id > 0)
        ON VIOLATION DROP ROW

    ,CONSTRAINT validity_unit_of_measure_populated
        EXPECT (unit_of_measure IS NOT NULL AND unit_of_measure <> '')
        
)
COMMENT 'Cleansed JDE F4101 Item Master - Silver (SeyTec Naming Convention)'
AS SELECT
    CAST(IMITM AS INT)                 AS item_id
    ,TRIM(IMLITM)                      AS item_number
    ,TRIM(IMAITM)                      AS item_number_tertiary
    ,TRIM(IMDSC1)                      AS item_description
    ,TRIM(IMDSC2)                      AS item_description_2
    ,TRIM(IMUOM)                       AS unit_of_measure
    ,TRIM(IMSTKT)                      AS stocking_type
    ,TRIM(IMGLPT)                      AS gl_class
    ,TRIM(IMPDGR)                      AS product_group
    ,TRIM(IMCIFM)                      AS country_of_origin
    ,CAST(IMUPMJ AS INT)               AS date_updated_julian
    ,current_timestamp()               AS silver_processed_at
FROM jde_demo.bronze.f4101_raw;


CREATE OR REFRESH MATERIALIZED VIEW jde_demo.silver.f03b11_cleansed (

    CONSTRAINT completeness_document_number
        EXPECT (document_number IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT completeness_customer_id
        EXPECT (customer_id IS NOT NULL)
        ON VIOLATION DROP ROW

    ,CONSTRAINT validity_document_number_positive
        EXPECT (document_number > 0)
        ON VIOLATION DROP ROW

    ,CONSTRAINT validity_customer_id_range
        EXPECT (customer_id > 0 AND customer_id < 99999999)
        ON VIOLATION FAIL UPDATE

    ,CONSTRAINT validity_amount_open_not_null
        EXPECT (amount_open IS NOT NULL)
        

    ,CONSTRAINT validity_amount_gross_non_negative
        EXPECT (amount_gross IS NULL OR amount_gross >= 0)
        

    ,CONSTRAINT timeliness_date_gl_not_future
        EXPECT (date_gl IS NULL OR date_gl <= CURRENT_DATE())
        

    ,CONSTRAINT timeliness_date_gl_not_ancient
        EXPECT (date_gl IS NULL OR date_gl >= DATE '2000-01-01')
        

    ,CONSTRAINT consistency_open_vs_gross
        EXPECT (
            amount_open IS NULL
            OR amount_gross IS NULL
            OR amount_open <= amount_gross
        )
        
)
COMMENT 'Cleansed JDE F03B11 AR Invoices - Silver (SeyTec Naming Convention)'
AS SELECT
    CAST(RPDOC AS INT)                 AS document_number
    ,TRIM(RPDCT)                       AS document_type
    ,TRIM(RPKCO)                       AS document_company
    ,CAST(RPAN8 AS INT)                AS customer_id

    ,CASE
        WHEN CAST(RPDGJ AS INT) > 0 THEN
            DATE_ADD(
                MAKE_DATE(1900 + FLOOR(CAST(RPDGJ AS INT) / 1000), 1, 1)
                ,CAST(RPDGJ AS INT) % 1000 - 1
            )
        ELSE NULL
     END                               AS date_gl

    ,CASE
        WHEN CAST(RPDDJ AS INT) > 0 THEN
            DATE_ADD(
                MAKE_DATE(1900 + FLOOR(CAST(RPDDJ AS INT) / 1000), 1, 1)
                ,CAST(RPDDJ AS INT) % 1000 - 1
            )
        ELSE NULL
     END                               AS date_due

    ,CASE
        WHEN CAST(RPDIVJ AS INT) > 0 THEN
            DATE_ADD(
                MAKE_DATE(1900 + FLOOR(CAST(RPDIVJ AS INT) / 1000), 1, 1)
                ,CAST(RPDIVJ AS INT) % 1000 - 1
            )
        ELSE NULL
     END                               AS date_invoice

    ,TRIM(RPCRCD)                      AS currency_code
    ,CAST(RPAAP AS DECIMAL(15,2))      AS amount_open
    ,CAST(RPAG AS DECIMAL(15,2))       AS amount_gross
    ,CAST(RPAOD AS DECIMAL(15,2))      AS amount_original_discount
    ,TRIM(RPPOST)                      AS post_status
    ,TRIM(RPST)                        AS payment_status
    ,TRIM(RPRMK)                       AS remark
    ,CAST(RPUPMJ AS INT)               AS date_updated_julian
    ,current_timestamp()               AS silver_processed_at
FROM jde_demo.bronze.f03b11_raw;