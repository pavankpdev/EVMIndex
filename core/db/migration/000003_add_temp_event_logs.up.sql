CREATE TABLE "event_logs" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "block_number" varchar NOT NULL,
  "tx_hash" varchar NOT NULL,
  "timestamp" timestamp NOT NULL,
  "from" varchar NOT NULL,
  "to" varchar NOT NULL,
  "token_id" varchar NOT NULL,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);