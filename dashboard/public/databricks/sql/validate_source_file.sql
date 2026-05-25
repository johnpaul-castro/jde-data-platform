SELECT 'F4201' AS table_name, COUNT(*) AS row_count FROM jde_demo.bronze.f4201_raw
UNION ALL
SELECT 'F4211', COUNT(*) FROM jde_demo.bronze.f4211_raw
UNION ALL
SELECT 'F0101', COUNT(*) FROM jde_demo.bronze.f0101_raw
UNION ALL
SELECT 'F0116', COUNT(*) FROM jde_demo.bronze.f0116_raw
UNION ALL
SELECT 'F4101', COUNT(*) FROM jde_demo.bronze.f4101_raw
UNION ALL
SELECT 'F03B11', COUNT(*) FROM jde_demo.bronze.f03b11_raw
ORDER BY table_name;