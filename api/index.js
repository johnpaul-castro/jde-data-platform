require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const { Pool } = require('pg')

const db = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({ host: 'localhost', port: 5432, database: 'jde_dw', user: 'jp', password: 'jp' })

fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
  req.rawBody = body
  try {
    done(null, JSON.parse(body.toString('utf8')))
  } catch (err) {
    done(err, undefined)
  }
})

fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000','http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'https://www.jpcenterprises.com', 'https://portal.jpcenterprises.com', 'https://shop.jpcenterprises.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
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

// ── Reports ──────────────────────────────────────────────────────────────
fastify.get('/api/reports/pipeline', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.order_id, h.sold_to_id, a.address_name AS customer_name,
      h.date_transaction, h.date_requested, h.date_promised,
      h.order_total, h.business_unit,
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
      CASE WHEN CURRENT_DATE - h.date_requested::date > 60 THEN true ELSE false END AS at_risk
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

fastify.get('/api/reports/purchase-orders', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.order_id, h.vendor_id, a.address_name AS vendor_name,
      h.date_transaction, h.date_requested, h.date_promised,
      h.order_total, h.business_unit,
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

fastify.get('/api/reports/customer-history', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.sold_to_id AS customer_id, a.address_name AS customer_name,
      COUNT(DISTINCT h.order_id) AS total_orders,
      SUM(d.extended_amount) AS total_value,
      AVG(d.extended_amount) AS avg_order_value,
      MIN(h.date_transaction) AS first_order,
      MAX(h.date_transaction) AS last_order,
      SUM(d.quantity_ordered) AS total_qty_ordered,
      SUM(d.quantity_shipped) AS total_qty_shipped,
      ROUND(CASE WHEN SUM(d.quantity_ordered) > 0
        THEN (SUM(d.quantity_shipped) / SUM(d.quantity_ordered)) * 100 ELSE 0 END, 1) AS fill_rate_pct
    FROM silver.sales_order_header h
    JOIN silver.sales_order_detail d ON h.order_id = d.order_id
    LEFT JOIN silver.address_book a ON h.sold_to_id = a.address_id
    GROUP BY h.sold_to_id, a.address_name
    ORDER BY total_value DESC
    LIMIT 50
  `)
  return result.rows
})

fastify.get('/api/reports/inventory-health', async (req, reply) => {
  const result = await db.query(`
    SELECT
      item_id, item_number, item_description, business_unit, unit_of_measure,
      product_group, quantity_on_hand, quantity_on_order, cost_average,
      price_list, inventory_value,
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

fastify.get('/api/reports/spend-analysis', async (req, reply) => {
  const result = await db.query(`
    SELECT
      h.vendor_id, a.address_name AS vendor_name,
      COUNT(DISTINCT h.order_id) AS total_orders,
      SUM(d.extended_amount) AS total_spend,
      AVG(d.unit_cost) AS avg_unit_cost,
      SUM(d.quantity_received) AS total_received,
      MIN(h.date_transaction) AS first_order,
      MAX(h.date_transaction) AS last_order,
      ROUND(SUM(d.extended_amount) * 100.0 /
        NULLIF(SUM(SUM(d.extended_amount)) OVER (), 0), 1) AS spend_pct
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
    SELECT address_id, address_name, address_type, tax_id, sic_code, credit_message
    FROM silver.address_book WHERE address_id = $1
  `, [id])
  const abdResult = await db.query(`
    SELECT address_line_1, address_line_2, city, state, zip_code, phone, country
    FROM silver.address_by_date WHERE address_id = $1 LIMIT 1
  `, [id])
  return { ...abResult.rows[0], ...abdResult.rows[0] }
})

fastify.get('/api/customers/:id/sales', async (req, reply) => {
  const { id } = req.params
  const { search } = req.query
  let query = `
    SELECT h.order_id, h.date_transaction, h.date_requested,
      SUM(d.extended_amount) AS order_total,
      COUNT(d.line_number) AS line_count,
      SUM(d.quantity_ordered) AS total_qty
    FROM silver.sales_order_header h
    JOIN silver.sales_order_detail d ON h.order_id = d.order_id
    WHERE h.sold_to_id = $1
  `
  const params = [id]
  if (search) {
    query += ` AND CAST(h.order_id AS TEXT) ILIKE $2`
    params.push(`%${search}%`)
  }
  query += ` GROUP BY h.order_id, h.date_transaction, h.date_requested ORDER BY h.date_transaction DESC`
  const result = await db.query(query, params)
  return result.rows
})

fastify.get('/api/customers/:id/orders/:order_id', async (req, reply) => {
  const { id, order_id } = req.params
  const customerRes = await db.query(`
    SELECT
      ab.address_id, ab.address_name,
      abd.address_line_1, abd.address_line_2,
      abd.city, abd.state, abd.zip_code AS zip,
      abd.phone
    FROM silver.address_book ab
    LEFT JOIN silver.address_by_date abd ON ab.address_id = abd.address_id
    WHERE ab.address_id = $1
    LIMIT 1
  `, [id])
  const headerRes = await db.query(`
    SELECT order_id, date_transaction, date_requested, sold_to_id
    FROM silver.sales_order_header WHERE order_id = $1
  `, [order_id])
  const linesRes = await db.query(`
    SELECT d.line_number, d.item_id, d.item_number,
      COALESCE(i.item_description, d.item_description) AS item_description,
      COALESCE(i.item_description_2, '') AS item_description_2,
      d.quantity_ordered, d.quantity_shipped, d.unit_of_measure,
      d.unit_price, d.extended_amount, d.next_status, d.last_status
    FROM silver.sales_order_detail d
    LEFT JOIN silver.item_master i ON d.item_id = i.item_id
    WHERE d.order_id = $1 ORDER BY d.line_number
  `, [order_id])
  return {
    customer: customerRes.rows[0] || {},
    header: headerRes.rows[0] || {},
    lines: linesRes.rows
  }
})

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
    FROM silver.address_book WHERE address_type = 'C'
  `)
  return result.rows[0]
})

// ── Status Boards ────────────────────────────────────────────────────────
fastify.get('/api/statusboard/shipments', async (req, reply) => {
  const result = await db.query(`
    SELECT order_id, customer_name, item_number, item_description,
      quantity_ordered, quantity_shipped, quantity_remaining,
      shipment_status, status_color, date_requested, date_promised,
      days_past_promise, is_overdue
    FROM gold.shipment_status
    ORDER BY is_overdue DESC, days_past_promise DESC
    LIMIT 200
  `)
  return result.rows
})

fastify.get('/api/statusboard/shipments/summary', async (req, reply) => {
  const result = await db.query(`
    SELECT shipment_status, status_color, COUNT(*) AS line_count,
      SUM(quantity_ordered) AS total_ordered,
      SUM(quantity_shipped) AS total_shipped,
      SUM(quantity_remaining) AS total_remaining,
      COUNT(*) FILTER (WHERE is_overdue) AS overdue_count
    FROM gold.shipment_status
    GROUP BY shipment_status, status_color
    ORDER BY shipment_status
  `)
  return result.rows
})

fastify.get('/api/statusboard/receiving', async (req, reply) => {
  const result = await db.query(`
    SELECT order_id, vendor_name, item_number, item_description,
      quantity_received, quantity_put_away, quantity_not_put_away,
      receiving_status, status_color, date_requested, date_promised,
      days_past_promise, is_overdue
    FROM gold.receiving_status
    ORDER BY is_overdue DESC, days_past_promise DESC
    LIMIT 200
  `)
  return result.rows
})

fastify.get('/api/statusboard/receiving/summary', async (req, reply) => {
  const result = await db.query(`
    SELECT receiving_status, status_color, COUNT(*) AS line_count,
      SUM(quantity_put_away) AS total_put_away,
      SUM(quantity_not_put_away) AS total_not_put_away,
      COUNT(*) FILTER (WHERE is_overdue) AS overdue_count
    FROM gold.receiving_status
    GROUP BY receiving_status, status_color
    ORDER BY receiving_status
  `)
  return result.rows
})

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

// ============================================================
// Shop endpoints
// ============================================================

fastify.get('/api/shop/products', async (req, reply) => {
  const result = await db.query(`
    SELECT
      item_number,
      MAX(item_description)  AS item_description,
      MAX(unit_of_measure)   AS unit_of_measure,
      MAX(gl_class)          AS gl_class,
      MAX(product_group)     AS product_group,
      MAX(price_list)        AS price_list,
      SUM(quantity_on_hand)  AS quantity_on_hand,
      SUM(quantity_on_order) AS quantity_on_order
    FROM gold.inventory_status
    GROUP BY item_number
    HAVING SUM(quantity_on_hand) > 0
    ORDER BY item_number
  `)
  return result.rows
})

fastify.post('/api/shop/checkout', async (req, reply) => {
  const Stripe = require('stripe')
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

  const { items, clerk_user_id, customer_email } = req.body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return reply.code(400).send({ error: 'items required' })
  }

  const itemNumbers = items.map(i => i.item_number)
  const productsRes = await db.query(`
    SELECT item_number,
      MAX(item_description) AS item_description,
      MAX(price_list)       AS price_list
    FROM gold.inventory_status
    WHERE item_number = ANY($1::text[])
    GROUP BY item_number
  `, [itemNumbers])

  const productMap = Object.fromEntries(productsRes.rows.map(r => [r.item_number, r]))

  const lineItems = items.map(i => {
    const p = productMap[i.item_number]
    if (!p) throw new Error(`Unknown item_number: ${i.item_number}`)
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: `${p.item_number} — ${p.item_description}` },
        unit_amount: Math.round(Number(p.price_list) * 100)
      },
      quantity: i.quantity
    }
  })

  const shopUrl = process.env.SHOP_URL || 'http://localhost:3003'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${shopUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: shopUrl,
    customer_email: customer_email || undefined
  })

  const sessionRes = await db.query(`
    INSERT INTO app.checkout_session
      (stripe_session_id, clerk_user_id, customer_email,
       amount_total_cents, currency_code, session_status, payment_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING checkout_session_key
  `, [session.id, clerk_user_id || null, customer_email || null,
      session.amount_total, session.currency, session.status, session.payment_status])

  const checkoutSessionKey = sessionRes.rows[0].checkout_session_key

  for (const i of items) {
    const p = productMap[i.item_number]
    const unitCents = Math.round(Number(p.price_list) * 100)
    await db.query(`
      INSERT INTO app.checkout_session_line
        (checkout_session_key, item_number, item_description,
         amount_unit_cents, quantity, amount_line_total_cents)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [checkoutSessionKey, p.item_number, p.item_description,
        unitCents, i.quantity, unitCents * i.quantity])
  }

  return { url: session.url, session_id: session.id }
})

fastify.post('/api/shop/webhooks/stripe', async (req, reply) => {
  const Stripe = require('stripe')
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret)
  } catch (err) {
    req.log.error(`Stripe webhook signature check failed: ${err.message}`)
    return reply.code(400).send({ error: 'Invalid signature' })
  }

  await db.query(`
    INSERT INTO app.stripe_webhook_event (stripe_event_id, event_type, payload_json)
    VALUES ($1, $2, $3)
    ON CONFLICT (stripe_event_id) DO NOTHING
  `, [event.id, event.type, event])

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object
    await db.query(`
      UPDATE app.checkout_session
      SET session_status = $1, payment_status = $2,
          stripe_payment_intent_id = $3, amount_total_cents = $4,
          dt_completed = now(), dt_updated = now()
      WHERE stripe_session_id = $5
    `, [s.status, s.payment_status, s.payment_intent, s.amount_total, s.id])
  }

  await db.query(`
    UPDATE app.stripe_webhook_event
    SET is_processed = true, dt_processed = now()
    WHERE stripe_event_id = $1
  `, [event.id])

  return { received: true }
})

// ─── MDM Endpoints ───────────────────────────────────────────

// Golden records summary
fastify.get('/api/mdm/golden-customers', async (req, reply) => {
  const result = await db.query(`
    SELECT golden_customer_id, golden_name, golden_city, golden_state,
           golden_postal_code, golden_tax_id, golden_email,
           primary_source, primary_source_id
    FROM mdm.customer_golden
    ORDER BY golden_name
  `)
  return result.rows
})

// Cross-reference: all source records grouped by golden ID
fastify.get('/api/mdm/customer-xref', async (req, reply) => {
  const result = await db.query(`
    SELECT cluster_id, source_system, source_customer_id, customer_name,
           name_clean, city, state_province, postal_code, tax_id, email
    FROM mdm.customer_xref
    ORDER BY cluster_id, source_system
  `)
  return result.rows
})

// Stats for the MDM overview
fastify.get('/api/mdm/stats', async (req, reply) => {
  const total = await db.query(`SELECT COUNT(*) AS count FROM mdm.customer_xref`)
  const golden = await db.query(`SELECT COUNT(*) AS count FROM mdm.customer_golden`)
  const bySource = await db.query(`
    SELECT source_system, COUNT(*) AS count
    FROM mdm.customer_xref
    GROUP BY source_system
    ORDER BY source_system
  `)
  const duplicates = await db.query(`
    SELECT cluster_id, COUNT(*) AS match_count
    FROM mdm.customer_xref
    GROUP BY cluster_id
    HAVING COUNT(*) > 1
    ORDER BY match_count DESC
    LIMIT 20
  `)
  return {
    total_source_records: parseInt(total.rows[0].count),
    golden_records: parseInt(golden.rows[0].count),
    duplicates_resolved: parseInt(total.rows[0].count) - parseInt(golden.rows[0].count),
    by_source: bySource.rows,
    top_duplicate_clusters: duplicates.rows
  }
})

// Detail for a single golden record
fastify.get('/api/mdm/golden-customers/:id', async (req, reply) => {
  const { id } = req.params
  const golden = await db.query(`
    SELECT * FROM mdm.customer_golden WHERE golden_customer_id = $1
  `, [id])
  const sources = await db.query(`
    SELECT * FROM mdm.customer_xref WHERE cluster_id = $1 ORDER BY source_system
  `, [id])
  return { golden: golden.rows[0] || null, sources: sources.rows }
})

// Sales aggregated by golden customer (add this with the other MDM endpoints in index.js)
fastify.get('/api/mdm/golden-sales', async (req, reply) => {
  const result = await db.query(`
    WITH all_sales AS (
      SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp1_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp2_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp3_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp4_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp5_sales
    )
    SELECT
      x.cluster_id,
      COUNT(DISTINCT s.order_id) AS total_orders,
      COALESCE(SUM(s.order_amount), 0) AS total_revenue,
      COUNT(DISTINCT s.source_system) AS erp_count,
      MIN(s.order_date) AS first_order,
      MAX(s.order_date) AS last_order
    FROM mdm.customer_xref x
    JOIN all_sales s
      ON x.source_system = s.source_system
      AND x.source_customer_id = s.source_customer_id
    GROUP BY x.cluster_id
    ORDER BY total_revenue DESC
  `)
  return result.rows
})

// MDM Sales Detail — all orders linked to golden customers
// Add this to api/index.js with the other MDM endpoints
fastify.get('/api/mdm/sales-detail', async (req, reply) => {
  const result = await db.query(`
    WITH all_sales AS (
      SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp1_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp2_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp3_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp4_sales
      UNION ALL SELECT source_system, source_customer_id, order_id, order_date, order_amount, currency_code
      FROM silver_erp.erp5_sales
    )
    SELECT
      s.order_id,
      s.source_system,
      s.source_customer_id,
      s.order_date,
      s.order_amount,
      s.currency_code,
      x.cluster_id AS golden_customer_id,
      x.customer_name AS source_customer_name,
      g.golden_name
    FROM all_sales s
    JOIN mdm.customer_xref x
      ON s.source_system = x.source_system
      AND s.source_customer_id = x.source_customer_id
    LEFT JOIN mdm.customer_golden g
      ON x.cluster_id = g.golden_customer_id
    ORDER BY s.order_date DESC
  `)
  return result.rows
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

start()
