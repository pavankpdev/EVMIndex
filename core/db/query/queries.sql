-- name: InsertEventLog :exec
INSERT INTO event_logs (
    block_number, 
    tx_hash, 
    timestamp, 
    "from", 
    "to", 
    token_id, 
    created_at, 
    updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6, DEFAULT, DEFAULT
);

-- name: GetEventLogByTxHash :one
SELECT * FROM event_logs WHERE tx_hash = $1;

-- name: GetEventLogsByBlockNumber :many
SELECT * FROM event_logs WHERE block_number = $1 ORDER BY timestamp DESC;

-- name: GetAllEventLogs :many
SELECT * FROM event_logs ORDER BY timestamp DESC LIMIT $1 OFFSET $2;

-- name: DeleteEventLogByTxHash :exec
DELETE FROM event_logs WHERE tx_hash = $1;

-- name: DeleteOldEventLogs :exec
DELETE FROM event_logs WHERE timestamp < NOW() - INTERVAL '30 days';

-- name: UpdateEventLog :exec
UPDATE event_logs
SET updated_at = CURRENT_TIMESTAMP
WHERE tx_hash = $1;
