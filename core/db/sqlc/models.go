// Code generated by sqlc. DO NOT EDIT.

package db

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type EventConfig struct {
	ID         uuid.UUID      `json:"id"`
	StartBlock sql.NullInt32  `json:"start_block"`
	Contract   sql.NullString `json:"contract"`
	ChainID    sql.NullInt32  `json:"chain_id"`
	Structure  sql.NullString `json:"structure"`
	CreatedAt  sql.NullTime   `json:"created_at"`
	UpdatedAt  sql.NullTime   `json:"updated_at"`
}

type EventLog struct {
	ID          uuid.UUID    `json:"id"`
	BlockNumber string       `json:"block_number"`
	TxHash      string       `json:"tx_hash"`
	Timestamp   time.Time    `json:"timestamp"`
	From        string       `json:"from"`
	To          string       `json:"to"`
	TokenID     string       `json:"token_id"`
	CreatedAt   sql.NullTime `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
}

type Network struct {
	ID        uuid.UUID      `json:"id"`
	ChainID   sql.NullInt32  `json:"chain_id"`
	Rpc       sql.NullString `json:"rpc"`
	Name      sql.NullString `json:"name"`
	CreatedAt sql.NullTime   `json:"created_at"`
}
