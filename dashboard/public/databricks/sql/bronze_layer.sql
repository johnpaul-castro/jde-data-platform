CREATE OR REFRESH STREAMING TABLE jde_demo.bronze.f4201_raw
COMMENT 'Raw JDE F4201 Sales Order Header - Bronze'
AS SELECT
    *
    ,current_timestamp() AS _ingestion_timestamp
    ,_metadata.file_path   AS _source_file
FROM STREAM read_files(
    '/Volumes/jde_demo/bronze/raw_files/'
    ,format => 'csv'
    ,header => true
    ,inferColumnTypes => true
    ,pathGlobFilter => 'F4201.csv'    
);

CREATE OR REFRESH STREAMING TABLE jde_demo.bronze.f4211_raw
COMMENT 'Raw JDE F4211 Sales Order Detail - Bronze'
AS SELECT
    *
    ,current_timestamp() AS _ingestion_timestamp
    ,_metadata.file_path   AS _source_file
FROM STREAM read_files(
    '/Volumes/jde_demo/bronze/raw_files/'
    ,format => 'csv'
    ,header => true
    ,inferColumnTypes => true
    ,pathGlobFilter => 'F4211.csv'    
);

CREATE OR REFRESH STREAMING TABLE jde_demo.bronze.f0101_raw
COMMENT 'Raw JDE F0101 Address Book - Bronze'
AS SELECT
    *
    ,current_timestamp() AS _ingestion_timestamp
    ,_metadata.file_path   AS _source_file
FROM STREAM read_files(
    '/Volumes/jde_demo/bronze/raw_files/'
    ,format => 'csv'
    ,header => true
    ,inferColumnTypes => true
    ,pathGlobFilter => 'F0101.csv'    
);

CREATE OR REFRESH STREAMING TABLE jde_demo.bronze.f0116_raw
COMMENT 'Raw JDE F0116 Address by Date - Bronze'
AS SELECT
    *
    ,current_timestamp() AS _ingestion_timestamp
    ,_metadata.file_path   AS _source_file
FROM STREAM read_files(
    '/Volumes/jde_demo/bronze/raw_files/'
    ,format => 'csv'
    ,header => true
    ,inferColumnTypes => true
    ,pathGlobFilter => 'F0116.csv'    
);

CREATE OR REFRESH STREAMING TABLE jde_demo.bronze.f4101_raw
COMMENT 'Raw JDE F4101 Item Master - Bronze'
AS SELECT
    *
    ,current_timestamp() AS _ingestion_timestamp
    ,_metadata.file_path   AS _source_file
FROM STREAM read_files(
    '/Volumes/jde_demo/bronze/raw_files/'
    ,format => 'csv'
    ,header => true
    ,inferColumnTypes => true
    ,pathGlobFilter => 'F4101.csv'    
);

CREATE OR REFRESH STREAMING TABLE jde_demo.bronze.f03b11_raw
COMMENT 'Raw JDE F03B11 AR Invoices - Bronze'
AS SELECT
    *
    ,current_timestamp() AS _ingestion_timestamp
    ,_metadata.file_path   AS _source_file
FROM STREAM read_files(
    '/Volumes/jde_demo/bronze/raw_files/'
    ,format => 'csv'
    ,header => true
    ,inferColumnTypes => true
    ,pathGlobFilter => 'F03B11.csv'    
);