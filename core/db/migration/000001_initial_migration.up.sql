CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "networks" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "chain_id" integer,
  "rpc" varchar,
  "name" varchar,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "event_config" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "start_block" integer,
  "contract" varchar,
  "chain_id" integer,
  "structure" json,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);
