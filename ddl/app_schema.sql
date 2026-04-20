CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.checkout_session (
    checkout_session_key      BIGSERIAL PRIMARY KEY,
    stripe_session_id         TEXT NOT NULL UNIQUE,
    stripe_payment_intent_id  TEXT,
    clerk_user_id             TEXT,
    customer_email            TEXT,
    amount_total_cents        INTEGER,
    currency_code             TEXT NOT NULL DEFAULT 'usd',
    session_status            TEXT NOT NULL,
    payment_status            TEXT,
    dt_created                TIMESTAMPTZ NOT NULL DEFAULT now(),
    dt_completed              TIMESTAMPTZ,
    dt_updated                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app.checkout_session_line (
    checkout_session_line_key  BIGSERIAL PRIMARY KEY,
    checkout_session_key       BIGINT NOT NULL REFERENCES app.checkout_session(checkout_session_key) ON DELETE CASCADE,
    item_number                TEXT NOT NULL,
    item_description           TEXT NOT NULL,
    amount_unit_cents          INTEGER NOT NULL,
    quantity                   INTEGER NOT NULL,
    amount_line_total_cents    INTEGER NOT NULL,
    dt_created                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app.stripe_webhook_event (
    stripe_webhook_event_key  BIGSERIAL PRIMARY KEY,
    stripe_event_id           TEXT NOT NULL UNIQUE,
    event_type                TEXT NOT NULL,
    payload_json              JSONB NOT NULL,
    is_processed              BOOLEAN NOT NULL DEFAULT false,
    dt_received               TIMESTAMPTZ NOT NULL DEFAULT now(),
    dt_processed              TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ix_checkout_session_stripe_id
    ON app.checkout_session(stripe_session_id);

CREATE INDEX IF NOT EXISTS ix_stripe_webhook_event_type
    ON app.stripe_webhook_event(event_type);

CREATE INDEX IF NOT EXISTS ix_stripe_webhook_event_unprocessed
    ON app.stripe_webhook_event(is_processed) WHERE is_processed = false;
