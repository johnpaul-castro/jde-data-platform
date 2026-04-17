const fastify = require('fastify')({ logger: true })
const { Pool } = require('pg')

const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'jde_dw',
  user: 'jp',
  password: 'jp'
})

fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:3001'
})

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date() }
})

// Get all customers from Silver
fastify.get('/api/customers', async (req, reply) => {
  const result = await db.query(`
    SELECT address_id, address_name, address_type, tax_id
    FROM silver.address_book
    WHERE address_type = 'C'
    ORDER BY address_name
    LIMIT 100
  `)
  return result.rows
})

// Get all items from Silver
fastify.get('/api/items', async (req, reply) => {
  const result = await db.query(`
    SELECT item_id, item_number AS item_name, item_description AS description, unit_of_measure
    FROM silver.item_master
    ORDER BY item_number
    LIMIT 100
  `)
  return result.rows
})

// Get inventory status from Gold
fastify.get('/api/inventory', async (req, reply) => {
  const result = await db.query(`
    SELECT *
    FROM gold.inventory_status
    ORDER BY quantity_on_hand DESC
    LIMIT 100
  `)
  return result.rows
})

// Get sales by customer from Gold
fastify.get('/api/sales', async (req, reply) => {
  const result = await db.query(`
    SELECT *
    FROM gold.sales_by_customer
    ORDER BY total_revenue DESC
    LIMIT 50
  `)
  return result.rows
})

// Get AR aging from Gold
fastify.get('/api/ar-aging', async (req, reply) => {
  const result = await db.query(`
    SELECT *
    FROM gold.ar_aging
    ORDER BY total_open DESC
    LIMIT 50
  `)
  return result.rows
})

// Submit RFQ
fastify.post('/api/rfq', async (req, reply) => {
  const { customer_id, item_id, quantity, notes } = req.body
  const result = await db.query(`
    INSERT INTO bronze.rfq_submissions
      (customer_id, item_id, quantity, notes, submitted_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `, [customer_id, item_id, quantity, notes])
  return result.rows[0]
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
    console.log('API running at http://localhost:3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Get customer detail with address
fastify.get('/api/customers/:id', async (req, reply) => {
  const { id } = req.params
  const abResult = await db.query(`
    SELECT address_id, address_name, address_type, tax_id,
           credit_rating, currency_code, sic_code
    FROM silver.address_book
    WHERE address_id = $1
  `, [id])

  const abdResult = await db.query(`
    SELECT address_line_1, address_line_2, city, state,
           zip_code, phone, country
    FROM silver.address_by_date
    WHERE address_id = $1
    LIMIT 1
  `, [id])

  return { ...abResult.rows[0], ...abdResult.rows[0] }
})

// Get sales detail for a specific customer
fastify.get('/api/customers/:id/sales', async (req, reply) => {
  const { id } = req.params
  const result = await db.query(`
    SELECT 
      h.order_id,
      h.date_transaction,
      h.date_requested,
      SUM(d.extended_amount) AS order_total,
      COUNT(d.line_number) AS line_count,
      SUM(d.quantity_ordered) AS total_qty
    FROM silver.sales_order_header h
    JOIN silver.sales_order_detail d ON h.order_id = d.order_id
    WHERE h.sold_to_id = $1
    GROUP BY h.order_id, h.date_transaction, h.date_requested
    ORDER BY h.date_transaction DESC
    LIMIT 10
  `, [id])
  return result.rows
})

start()
