-- name: CreateEventConfig :one
INSERT INTO event_config (start_block, contract, chain_id, structure)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetEventConfigByID :one
SELECT * FROM event_config WHERE id = $1;

-- name: GetEventConfigByContract :many
SELECT * FROM event_config WHERE contract = $1;

-- name: GetAllEventConfigs :many
SELECT * FROM event_config;

-- name: UpdateEventConfig :one
UPDATE event_config
SET start_block = $2, contract = $3, chain_id = $4, structure = $5, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteEventConfig :exec
DELETE FROM event_config WHERE id = $1;
