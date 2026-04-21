# JDE Data Platform

A live, end-to-end modern data platform demo built on open-source tools. Pulls data from a simulated JD Edwards ERP, transforms it through a medallion architecture (Bronze → Silver → Gold), and serves it to a dashboard, customer portal, and e-commerce storefront.

**Live demo:** [jpcenterprises.com](https://jpcenterprises.com)

---

## What this is

This is a portfolio project demonstrating production-grade data architecture patterns — the kind of system I design and build for enterprises with critical data locked in legacy ERP systems.

- **Bronze Layer** — Raw data extracted directly from JDE SQL Server
- **Silver Layer** — Cleaned, typed, deduplicated via dbt Core with Kimball naming conventions
- **Gold Layer** — Business-ready aggregations and dimensional models
- **Operational Layer** (`app` schema) — Stripe checkout sessions, webhook events, customer order state

## Architecture
JDE SQL Server
↓
Node.js extractors (async, pg + mssql drivers)
↓
PostgreSQL — Bronze schema (raw)
↓
dbt Core — Silver schema (cleaned, typed, SCD2 where relevant)
↓
dbt Core — Gold schema (Kimball dimensional, business-ready)
↓
Fastify API ──→ Next.js dashboard (www.jpcenterprises.com)
├─→ Next.js customer portal (portal.jpcenterprises.com)
└─→ Next.js e-commerce shop (shop.jpcenterprises.com)

Orchestrated nightly by Apache Airflow. Deployed to Railway.

## Tech Stack

**Data platform**
- PostgreSQL (three-schema medallion: bronze / silver / gold)
- dbt Core (transformations, tests, dimensional modeling)
- Apache Airflow (orchestration, retries, alerting)
- Node.js (SQL Server → PostgreSQL extractors)
- Fastify (REST API serving all apps)

**Applications**
- Next.js 16 (App Router, TypeScript, Tailwind v4, React 19)
- Clerk (authentication for the customer portal)
- Stripe Checkout (payments for the e-commerce shop)
- `@react-pdf/renderer` (packing slip PDF generation)

**Deployment**
- Railway (single project, multiple services, private networking)
- Custom domains via GoDaddy DNS

## Repository layout
jde-data-platform/
├── airflow/dags/        # Nightly pipeline DAGs
├── api/                 # Fastify API (index.js, serves all apps)
├── customer-portal/     # Next.js customer self-service portal
├── dashboard/           # Next.js main dashboard + architecture/resume pages
├── dbt/jde/             # dbt project (silver + gold models)
├── ddl/                 # One-off DDL (app schema for Stripe state)
├── extractors/          # Node.js Bronze extraction
├── shop/                # Next.js e-commerce storefront
├── Dockerfile           # Airflow + dbt + Node image
├── docker-compose.yml   # Local dev stack
└── profiles.yml         # dbt profiles

## Design principles

- **Open source only** for the data platform layer (no vendor lock-in)
- **Idempotent pipelines** — every layer can be rebuilt from the layer below
- **Naming standards enforced** — `date_` prefix for timestamps, `count_` for metrics, entity-first for identifiers, `_key` suffix for surrogate keys
- **Kimball dimensional modeling** in Gold — dim/fact pattern, grain documented, surrogate keys
- **Application data separate from analytics data** — `app` schema for operational state (Stripe sessions, webhook events), never mixed with `gold`

## About

Built by **JP Castro** — Senior Data Platform Architect with 20+ years in enterprise data systems across aerospace, entertainment, telecom, and software consulting.

- Email: johnpaulcastro@gmail.com
- LinkedIn: [linkedin.com/in/johnpaul-castro](https://linkedin.com/in/johnpaul-castro)
- Portfolio: [jpcenterprises.com](https://jpcenterprises.com)
