// Code generated by sqlc. DO NOT EDIT.
// source: queries.sql

package db

import (
	"context"
	"time"
)

const deleteEventLogByTxHash = `-- name: DeleteEventLogByTxHash :exec
DELETE FROM event_logs WHERE tx_hash = $1
`

func (q *Queries) DeleteEventLogByTxHash(ctx context.Context, txHash string) error {
	_, err := q.db.ExecContext(ctx, deleteEventLogByTxHash, txHash)
	return err
}

const deleteOldEventLogs = `-- name: DeleteOldEventLogs :exec
DELETE FROM event_logs WHERE timestamp < NOW() - INTERVAL '30 days'
`

func (q *Queries) DeleteOldEventLogs(ctx context.Context) error {
	_, err := q.db.ExecContext(ctx, deleteOldEventLogs)
	return err
}

const getAllEventLogs = `-- name: GetAllEventLogs :many
SELECT id, block_number, tx_hash, timestamp, "from", "to", token_id, created_at, updated_at FROM event_logs ORDER BY timestamp DESC LIMIT $1 OFFSET $2
`

type GetAllEventLogsParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) GetAllEventLogs(ctx context.Context, arg GetAllEventLogsParams) ([]EventLog, error) {
	rows, err := q.db.QueryContext(ctx, getAllEventLogs, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []EventLog{}
	for rows.Next() {
		var i EventLog
		if err := rows.Scan(
			&i.ID,
			&i.BlockNumber,
			&i.TxHash,
			&i.Timestamp,
			&i.From,
			&i.To,
			&i.TokenID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getEventLogByTxHash = `-- name: GetEventLogByTxHash :one
SELECT id, block_number, tx_hash, timestamp, "from", "to", token_id, created_at, updated_at FROM event_logs WHERE tx_hash = $1
`

func (q *Queries) GetEventLogByTxHash(ctx context.Context, txHash string) (EventLog, error) {
	row := q.db.QueryRowContext(ctx, getEventLogByTxHash, txHash)
	var i EventLog
	err := row.Scan(
		&i.ID,
		&i.BlockNumber,
		&i.TxHash,
		&i.Timestamp,
		&i.From,
		&i.To,
		&i.TokenID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getEventLogsByBlockNumber = `-- name: GetEventLogsByBlockNumber :many
SELECT id, block_number, tx_hash, timestamp, "from", "to", token_id, created_at, updated_at FROM event_logs WHERE block_number = $1 ORDER BY timestamp DESC
`

func (q *Queries) GetEventLogsByBlockNumber(ctx context.Context, blockNumber string) ([]EventLog, error) {
	rows, err := q.db.QueryContext(ctx, getEventLogsByBlockNumber, blockNumber)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []EventLog{}
	for rows.Next() {
		var i EventLog
		if err := rows.Scan(
			&i.ID,
			&i.BlockNumber,
			&i.TxHash,
			&i.Timestamp,
			&i.From,
			&i.To,
			&i.TokenID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const insertEventLog = `-- name: InsertEventLog :exec
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
)
`

type InsertEventLogParams struct {
	BlockNumber string    `json:"block_number"`
	TxHash      string    `json:"tx_hash"`
	Timestamp   time.Time `json:"timestamp"`
	From        string    `json:"from"`
	To          string    `json:"to"`
	TokenID     string    `json:"token_id"`
}

func (q *Queries) InsertEventLog(ctx context.Context, arg InsertEventLogParams) error {
	_, err := q.db.ExecContext(ctx, insertEventLog,
		arg.BlockNumber,
		arg.TxHash,
		arg.Timestamp,
		arg.From,
		arg.To,
		arg.TokenID,
	)
	return err
}

const updateEventLog = `-- name: UpdateEventLog :exec
UPDATE event_logs
SET updated_at = CURRENT_TIMESTAMP
WHERE tx_hash = $1
`

func (q *Queries) UpdateEventLog(ctx context.Context, txHash string) error {
	_, err := q.db.ExecContext(ctx, updateEventLog, txHash)
	return err
}
