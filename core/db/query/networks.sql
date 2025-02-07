-- name: CreateNetwork :one
INSERT INTO networks (chain_id, rpc, name)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetNetworkByID :one
SELECT * FROM networks WHERE id = $1;

-- name: GetAllNetworks :many
SELECT * FROM networks;

-- name: UpdateNetwork :one
UPDATE networks
SET chain_id = $2, rpc = $3, name = $4
WHERE id = $1
RETURNING *;

-- name: DeleteNetwork :exec
DELETE FROM networks WHERE id = $1;
