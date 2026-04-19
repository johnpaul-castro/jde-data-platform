/**
 * JDE Bronze Extractor
 * Usage:
 *   node extract_all.js          — extracts all tables
 *   node extract_all.js F4211    — extracts a single table
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

const ALL_TABLES = [
  'F0101','F0116','F03B11','F4101','F4102',
  'F41021','F4201','F4211','F4301','F4311'
];

async function extractTable(srcPool, tableName) {
  console.log(`[${new Date().toISOString()}] Extracting ${tableName}...`);
  const result = await srcPool.request().query(`SELECT * FROM ${tableName}`);
  const rows = result.recordset;

  if (rows.length === 0) { console.log(`  ${tableName}: 0 rows — skipping`); return; }

  const cols = Object.keys(rows[0]);
  const pgClient = await pg.connect();

  try {
    await pgClient.query(`CREATE SCHEMA IF NOT EXISTS bronze`);
    await pgClient.query(`DROP TABLE IF EXISTS bronze."${tableName}"`);
    const colDefs = cols.map(c => `"${c}" TEXT`).join(', ');
    await pgClient.query(`CREATE TABLE bronze."${tableName}" (${colDefs}, raw_synced_at TIMESTAMP DEFAULT NOW())`);

    const BATCH_SIZE = 500;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const valueClauses = [];
      const allVals = [];
      let paramIdx = 1;
      for (const row of batch) {
        const vals = cols.map(c => row[c] === null ? null : String(row[c]));
        valueClauses.push(`(${vals.map(() => `$${paramIdx++}`).join(', ')})`);
        allVals.push(...vals);
      }
      await pgClient.query(
        `INSERT INTO bronze."${tableName}" (${cols.map(c=>`"${c}"`).join(', ')}) VALUES ${valueClauses.join(', ')}`,
        allVals
      );
    }
    console.log(`  ✅ ${tableName}: ${rows.length} rows loaded`);
  } finally {
    pgClient.release();
  }
}

async function run() {
  const targetTable = process.argv[2] ? process.argv[2].toUpperCase() : null;
  if (targetTable && !ALL_TABLES.includes(targetTable)) {
    console.error(`❌ Unknown table: ${targetTable}`);
    process.exit(1);
  }
  const tables = targetTable ? [targetTable] : ALL_TABLES;
  const srcPool = await sql.connect(srcConfig);
  for (const table of tables) { await extractTable(srcPool, table); }
  await sql.close();
  await pg.end();
  console.log(`\n✅ Extraction complete: ${tables.join(', ')}`);
}

run().catch(err => { console.error('❌ Extraction failed:', err.message); process.exit(1); });
