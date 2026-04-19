const fastify = require('fastify')({ logger: true })
const { Pool } = require('pg')

const db = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({ host: 'localhost', port: 5432, database: 'jde_dw', user: 'jp', password: 'jp' })

fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3001', 'http://localhost:3003', 'http://localhost:3004', /\.railway\.app$/]
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
    await fastify.listen({ port: parseInt(process.env.PORT) || 3001, host: '0.0.0.0' })
    console.log('API running at http://localhost:3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// ── Reports (must be before :id wildcard routes) ──────────────────────────
// Report 1 — Pipeline Report (Sales Order Aging)
fastify.get('/api/reports/pipeline', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.order_id,
      h.sold_to_id,
      a.address_name AS customer_name,
      h.date_transaction,
      h.date_requested,
      h.date_promised,
      h.order_total,
      h.business_unit,
      COUNT(d.line_number) AS line_count,
      SUM(d.quantity_ordered) AS total_qty,
      SUM(d.quantity_shipped) AS total_shipped,
      SUM(d.extended_amount) AS total_value,
      CURRENT_DATE - h.date_requested::date AS days_outstanding,
      CASE
        WHEN CURRENT_DATE - h.date_requested::date <= 30 THEN '0-30 days'
        WHEN CURRENT_DATE - h.date_requested::date <= 60 THEN '31-60 days'
        WHEN CURRENT_DATE - h.date_requested::date <= 90 THEN '61-90 days'
        ELSE '90+ days'
      END AS aging_bucket,
      CASE
        WHEN CURRENT_DATE - h.date_requested::date > 60 THEN true
        ELSE false
      END AS at_risk
    FROM silver.sales_order_header h
    JOIN silver.sales_order_detail d ON h.order_id = d.order_id
    LEFT JOIN silver.address_book a ON h.sold_to_id = a.address_id
    GROUP BY h.order_id, h.sold_to_id, a.address_name,
             h.date_transaction, h.date_requested, h.date_promised,
             h.order_total, h.business_unit
    ORDER BY days_outstanding DESC
    LIMIT 100
  `)
  return result.rows
})

// Report 2 — Purchase Order Status
fastify.get('/api/reports/purchase-orders', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.order_id,
      h.vendor_id,
      a.address_name AS vendor_name,
      h.date_transaction,
      h.date_requested,
      h.date_promised,
      h.order_total,
      h.business_unit,
      COUNT(d.line_number) AS line_count,
      SUM(d.quantity_received) AS total_received,
      SUM(d.extended_amount) AS total_value,
      CURRENT_DATE - h.date_requested::date AS days_outstanding,
      CASE
        WHEN CURRENT_DATE - h.date_requested::date <= 30 THEN '0-30 days'
        WHEN CURRENT_DATE - h.date_requested::date <= 60 THEN '31-60 days'
        WHEN CURRENT_DATE - h.date_requested::date <= 90 THEN '61-90 days'
        ELSE '90+ days'
      END AS aging_bucket
    FROM silver.purchase_order_header h
    JOIN silver.purchase_order_detail d ON h.order_id = d.order_id
    LEFT JOIN silver.address_book a ON h.vendor_id = a.address_id
    GROUP BY h.order_id, h.vendor_id, a.address_name,
             h.date_transaction, h.date_requested, h.date_promised,
             h.order_total, h.business_unit
    ORDER BY days_outstanding DESC
    LIMIT 100
  `)
  return result.rows
})

// Report 3 — Customer Order History
fastify.get('/api/reports/customer-history', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.sold_to_id AS customer_id,
      a.address_name AS customer_name,
      COUNT(DISTINCT h.order_id) AS total_orders,
      SUM(d.extended_amount) AS total_value,
      AVG(d.extended_amount) AS avg_order_value,
      MIN(h.date_transaction) AS first_order,
      MAX(h.date_transaction) AS last_order,
      SUM(d.quantity_ordered) AS total_qty_ordered,
      SUM(d.quantity_shipped) AS total_qty_shipped,
      ROUND(
        CASE WHEN SUM(d.quantity_ordered) > 0
          THEN (SUM(d.quantity_shipped) / SUM(d.quantity_ordered)) * 100
          ELSE 0
        END, 1
      ) AS fill_rate_pct
    FROM silver.sales_order_header h
    JOIN silver.sales_order_detail d ON h.order_id = d.order_id
    LEFT JOIN silver.address_book a ON h.sold_to_id = a.address_id
    GROUP BY h.sold_to_id, a.address_name
    ORDER BY total_value DESC
    LIMIT 50
  `)
  return result.rows
})

// Report 4 — Inventory Health
fastify.get('/api/reports/inventory-health', async (req, reply) => {
  const result = await db.query(`
    SELECT
      item_id,
      item_number,
      item_description,
      business_unit,
      unit_of_measure,
      product_group,
      quantity_on_hand,
      quantity_on_order,
      cost_average,
      price_list,
      inventory_value,
      CASE
        WHEN quantity_on_hand = 0 THEN 'Out of Stock'
        WHEN quantity_on_hand < 10 THEN 'Low Stock'
        WHEN quantity_on_hand < 50 THEN 'Normal'
        ELSE 'Well Stocked'
      END AS stock_status,
      CASE
        WHEN quantity_on_hand = 0 THEN 'danger'
        WHEN quantity_on_hand < 10 THEN 'warning'
        ELSE 'good'
      END AS status_color
    FROM gold.inventory_status
    ORDER BY quantity_on_hand ASC
    LIMIT 100
  `)
  return result.rows
})

// Report 5 — Spend Analysis
fastify.get('/api/reports/spend-analysis', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.vendor_id,
      a.address_name AS vendor_name,
      COUNT(DISTINCT h.order_id) AS total_orders,
      SUM(d.extended_amount) AS total_spend,
      AVG(d.unit_cost) AS avg_unit_cost,
      SUM(d.quantity_received) AS total_received,
      MIN(h.date_transaction) AS first_order,
      MAX(h.date_transaction) AS last_order,
      ROUND(
        SUM(d.extended_amount) * 100.0 /
        NULLIF(SUM(SUM(d.extended_amount)) OVER (), 0), 1
      ) AS spend_pct
    FROM silver.purchase_order_header h
    JOIN silver.purchase_order_detail d ON h.order_id = d.order_id
    LEFT JOIN silver.address_book a ON h.vendor_id = a.address_id
    GROUP BY h.vendor_id, a.address_name
    ORDER BY total_spend DESC
    LIMIT 50
  `)
  return result.rows
})

fastify.get('/api/customers/:id', async (req, reply) => {
  const { id } = req.params
  const abResult = await db.query(`
    SELECT address_id, address_name, address_type, tax_id,
           sic_code, credit_message
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

// Get purchasing by vendor from Gold
fastify.get('/api/purchasing', async (req, reply) => {
  const result = await db.query(`
    SELECT vendor_id, vendor_name, total_orders, total_received,
           total_spend, avg_unit_cost, last_order_date
    FROM gold.purchasing_by_vendor
    ORDER BY total_spend DESC
    LIMIT 10
  `)
  return result.rows
})


start()

fastify.get('/api/debug/columns', async (req, reply) => {
  const result = await db.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema='silver' AND table_name='sales_order_header'
    ORDER BY ordinal_position
  `)
  return result.rows
})

fastify.get('/api/debug/customers', async (req, reply) => {
  const result = await db.query(`
    SELECT COUNT(*) as total, MIN(address_name) as first_name, MAX(address_name) as last_name
    FROM silver.address_book 
    WHERE address_type = 'C'
  `)
  return result.rows[0]
})

// Shipment Status Board
fastify.get('/api/statusboard/shipments', async (req, reply) => {
  const result = await db.query(`
    SELECT
      order_id,
      customer_name,
      item_number,
      item_description,
      quantity_ordered,
      quantity_shipped,
      quantity_remaining,
      shipment_status,
      status_color,
      date_requested,
      date_promised,
      days_past_promise,
      is_overdue
    FROM gold.shipment_status
    ORDER BY is_overdue DESC, days_past_promise DESC
    LIMIT 200
  `)
  return result.rows
})

// Shipment summary counts
fastify.get('/api/statusboard/shipments/summary', async (req, reply) => {
  const result = await db.query(`
    SELECT
      shipment_status,
      status_color,
      COUNT(*)                    AS line_count,
      SUM(quantity_ordered)       AS total_ordered,
      SUM(quantity_shipped)       AS total_shipped,
      SUM(quantity_remaining)     AS total_remaining,
      COUNT(*) FILTER (WHERE is_overdue) AS overdue_count
    FROM gold.shipment_status
    GROUP BY shipment_status, status_color
    ORDER BY shipment_status
  `)
  return result.rows
})

// Receiving Status Board
fastify.get('/api/statusboard/receiving', async (req, reply) => {
  const result = await db.query(`
    SELECT
      order_id,
      vendor_name,
      item_number,
      item_description,
      quantity_received,
      quantity_put_away,
      quantity_not_put_away,
      receiving_status,
      status_color,
      date_requested,
      date_promised,
      days_past_promise,
      is_overdue
    FROM gold.receiving_status
    ORDER BY is_overdue DESC, days_past_promise DESC
    LIMIT 200
  `)
  return result.rows
})

// Receiving summary counts
fastify.get('/api/statusboard/receiving/summary', async (req, reply) => {
  const result = await db.query(`
    SELECT
      receiving_status,
      status_color,
      COUNT(*)                        AS line_count,
      SUM(quantity_put_away)          AS total_put_away,
      SUM(quantity_not_put_away)      AS total_not_put_away,
      COUNT(*) FILTER (WHERE is_overdue) AS overdue_count
    FROM gold.receiving_status
    GROUP BY receiving_status, status_color
    ORDER BY receiving_status
  `)
  return result.rows
})

// Vendors
fastify.get('/api/vendors', async (req, reply) => {
  const result = await db.query(`
    SELECT address_id, address_name, address_type, tax_id
    FROM silver.address_book
    WHERE address_type = 'V'
    ORDER BY address_name
    LIMIT 100
  `)
  return result.rows
})

// Employees
fastify.get('/api/employees', async (req, reply) => {
  const result = await db.query(`
    SELECT address_id, address_name, address_type, tax_id
    FROM silver.address_book
    WHERE address_type = 'E'
    ORDER BY address_name
    LIMIT 100
  `)
  return result.rows
})
