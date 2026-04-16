const sql = require('mssql');
const { Pool } = require('pg');

const srcConfig = {
  user: 'jde_user',
  password: 'jde_pass',
  server: '192.168.65.254',
  port: 1433,
  database: 'jde_demo',
  options: { trustServerCertificate: true }
};

const pg = new Pool({ host: 'postgres', port: 5432, database: 'jde_dw', user: 'jp', password: 'jp' });

const tables = ['F0101','F0116','F03B11','F4101','F4102','F41021','F4201','F4211','F4301','F4311'];

async function extractTable(srcPool, tableName) {
  console.log(`Extracting ${tableName}...`);
  const result = await srcPool.request().query(`SELECT * FROM ${tableName}`);
  const rows = result.recordset;
  if (rows.length === 0) { console.log(`  ${tableName}: 0 rows`); return; }

  const cols = Object.keys(rows[0]);
  const pgClient = await pg.connect();
  try {
    await pgClient.query(`CREATE SCHEMA IF NOT EXISTS bronze`);
    await pgClient.query(`DROP TABLE IF EXISTS bronze."${tableName}"`);
    const colDefs = cols.map(c => `"${c}" TEXT`).join(', ');
    await pgClient.query(`CREATE TABLE bronze."${tableName}" (${colDefs}, raw_synced_at TIMESTAMP DEFAULT NOW())`);

    for (const row of rows) {
      const vals = cols.map(c => row[c] === null ? null : String(row[c]));
      const placeholders = vals.map((_, i) => `$${i+1}`).join(', ');
      await pgClient.query(`INSERT INTO bronze."${tableName}" (${cols.map(c=>`"${c}"`).join(', ')}) VALUES (${placeholders})`, vals);
    }
    console.log(`  ✅ ${tableName}: ${rows.length} rows loaded`);
  } finally {
    pgClient.release();
  }
}

async function run() {
  const srcPool = await sql.connect(srcConfig);
  for (const table of tables) {
    await extractTable(srcPool, table);
  }
  await sql.close();
  await pg.end();
  console.log('\n✅ All tables extracted to bronze schema!');
}

run().catch(console.error);
