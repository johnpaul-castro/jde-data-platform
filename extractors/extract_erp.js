/**
 * extract_erp.js — extracts customer + sales from erp1–erp5 into PostgreSQL bronze schemas
 * Usage:
 *   node extract_erp.js          — extracts all 5 ERPs
 *   node extract_erp.js erp3     — extracts a single ERP
 */

const sql = require('mssql');
const { Pool } = require('pg');

const srcConfig = {
  user: 'jde_user',
  password: 'jde_pass',
  server: '172.17.224.1',
  port: 1433,
  database: 'jde_demo',
  options: { trustServerCertificate: true }
};

const pg = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'jde_dw',
  user: 'jp',
  password: 'jp'
});

const ERP_TABLES = {
  erp1: {
    customer: {
      cols: 'cust_id, cust_name, cust_address, cust_town, cust_county, cust_postcode, cust_country, cust_vat_no, cust_email, loaded_at',
      pgCols: 'cust_id, cust_name, cust_address, cust_town, cust_county, cust_postcode, cust_country, cust_vat_no, cust_email, loaded_at',
      types: 'INT, VARCHAR(100), VARCHAR(100), VARCHAR(50), VARCHAR(50), VARCHAR(15), VARCHAR(30), VARCHAR(20), VARCHAR(100), TIMESTAMP'
    },
    sales: {
      cols: 'sales_order_no, cust_id, sales_order_dt, sales_order_amt, currency_cd, loaded_at',
      pgCols: 'sales_order_no, cust_id, sales_order_dt, sales_order_amt, currency_cd, loaded_at',
      types: 'VARCHAR(20), INT, DATE, DECIMAL, VARCHAR(3), TIMESTAMP'
    }
  },
  erp2: {
    customer: {
      cols: 'CustNum, CustName, AddrLn1, CityNm, StProv, PostCd, TIN, EmlAddr, PhoneNum, loaded_at',
      pgCols: 'custnum, custname, addrln1, citynm, stprov, postcd, tin, emladdr, phonenum, loaded_at',
      types: 'INT, VARCHAR(100), VARCHAR(100), VARCHAR(50), VARCHAR(10), VARCHAR(15), VARCHAR(20), VARCHAR(100), VARCHAR(20), TIMESTAMP'
    },
    sales: {
      cols: 'OrdId, CustNum, OrdDt, OrdAmt, loaded_at',
      pgCols: 'ordid, custnum, orddt, ordamt, loaded_at',
      types: 'VARCHAR(20), INT, DATE, DECIMAL, TIMESTAMP'
    }
  },
  erp3: {
    customer: {
      cols: 'customer_number, customer_name, street1, city, state_code, postal_code, federal_tax_id, contact_email, loaded_at',
      pgCols: 'customer_number, customer_name, street1, city, state_code, postal_code, federal_tax_id, contact_email, loaded_at',
      types: 'INT, VARCHAR(100), VARCHAR(100), VARCHAR(50), VARCHAR(10), VARCHAR(15), VARCHAR(20), VARCHAR(100), TIMESTAMP'
    },
    sales: {
      cols: 'order_id, customer_number, order_date, order_amount, loaded_at',
      pgCols: 'order_id, customer_number, order_date, order_amount, loaded_at',
      types: 'VARCHAR(20), INT, DATE, DECIMAL, TIMESTAMP'
    }
  },
  erp4: {
    customer: {
      cols: 'cust_key, name, addr_line_1, city_name, st, zip_cd, tax_id, email_addr, loaded_at',
      pgCols: 'cust_key, name, addr_line_1, city_name, st, zip_cd, tax_id, email_addr, loaded_at',
      types: 'INT, VARCHAR(100), VARCHAR(100), VARCHAR(50), VARCHAR(10), VARCHAR(10), VARCHAR(20), VARCHAR(100), TIMESTAMP'
    },
    sales: {
      cols: 'so_num, cust_key, so_dt, so_amt, loaded_at',
      pgCols: 'so_num, cust_key, so_dt, so_amt, loaded_at',
      types: 'VARCHAR(20), INT, DATE, DECIMAL, TIMESTAMP'
    }
  },
  erp5: {
    customer: {
      cols: 'CUST_ID, CUST_NAME, ADDR1, CITY, STATE, ZIP, TAX_ID, EMAIL, loaded_at',
      pgCols: 'cust_id, cust_name, addr1, city, state, zip, tax_id, email, loaded_at',
      types: 'INT, VARCHAR(100), VARCHAR(100), VARCHAR(50), VARCHAR(10), VARCHAR(10), VARCHAR(20), VARCHAR(100), TIMESTAMP'
    },
    sales: {
      cols: 'ORD_NUM, CUST_ID, ORD_DATE, ORD_AMT, loaded_at',
      pgCols: 'ord_num, cust_id, ord_date, ord_amt, loaded_at',
      types: 'VARCHAR(20), INT, DATE, DECIMAL, TIMESTAMP'
    }
  }
};

async function extractTable(srcPool, erpName, tableName) {
  const def = ERP_TABLES[erpName][tableName];
  const pgSchema = `bronze_${erpName}`;

  console.log(`[${new Date().toISOString()}] Extracting ${erpName}.${tableName}...`);

  // Pull from SQL Server
  const result = await srcPool.request().query(`SELECT ${def.cols} FROM ${erpName}.${tableName}`);
  const rows = result.recordset;
  console.log(`  → ${rows.length} rows fetched from SQL Server`);

  if (rows.length === 0) {
    console.log(`  → Skipping (no data)`);
    return;
  }

  // Create PG table
  const pgColDefs = def.pgCols.split(', ').map((col, i) => `${col} ${def.types.split(', ')[i]}`).join(', ');
  await pg.query(`DROP TABLE IF EXISTS ${pgSchema}.${tableName}`);
  await pg.query(`CREATE TABLE ${pgSchema}.${tableName} (${pgColDefs})`);

  // Insert rows
  const colArr = def.pgCols.split(', ');
  const srcColArr = def.cols.split(', ');
  const placeholders = colArr.map((_, i) => `$${i + 1}`).join(', ');
  const insertSQL = `INSERT INTO ${pgSchema}.${tableName} (${def.pgCols}) VALUES (${placeholders})`;

  for (const row of rows) {
    const vals = srcColArr.map(c => row[c.trim()] ?? null);
    await pg.query(insertSQL, vals);
  }

  console.log(`  → ${rows.length} rows loaded into ${pgSchema}.${tableName}`);
}

async function main() {
  const targetErp = process.argv[2]; // optional: 'erp1', 'erp2', etc.
  const erps = targetErp ? [targetErp] : Object.keys(ERP_TABLES);

  const srcPool = await sql.connect(srcConfig);

  for (const erp of erps) {
    await extractTable(srcPool, erp, 'customer');
    await extractTable(srcPool, erp, 'sales');
  }

  await srcPool.close();
  await pg.end();
  console.log(`[${new Date().toISOString()}] Done.`);
}

main().catch(err => { console.error(err); process.exit(1); });
