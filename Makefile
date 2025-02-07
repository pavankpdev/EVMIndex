postgres:
	docker run --name evm-indexer -p 5434:5432 -e POSTGRES_PASSWORD=evm-indexer -e POSTGRES_USER=evm-indexer -d postgres:12-alpine

migrateup:
	migrate -path core/db/migration -database "postgresql://evm-indexer:evm-indexer@localhost:6843/evm-indexer?sslmode=disable" -verbose up

migratedown:
	migrate -path core/db/migration -database "postgresql://evm-indexer:evm-indexer@localhost:5434/evm-indexer?sslmode=disable" -verbose down

sqlc:
	sqlc generate

test:
	go test -v -cover ./...

server:
	go run main.go

mock:
	mockgen -package mockdb -destination db/mock/store.go github.com/devatfido/backend-fidociary/db/sqlc Store

.PHONY: postgres createdb dropdb migrateup migratedown sqlc test server mock