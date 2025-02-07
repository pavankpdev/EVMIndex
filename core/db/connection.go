package db

import (
	"database/sql"
	"log"

	config "github.com/pavankpdev/EVMIndex/core"
)

var dbConn *sql.DB

func GetDbConnection() *sql.DB {
	var err error
	config, err := config.LoadConfig(".")

	if err != nil {
		log.Fatal("Cannot connect to the DB", err)
	}

	if dbConn == nil {
		dbConn, err = sql.Open(config.DBDriver, config.DBSource)
		if err != nil {
			log.Fatalf("Cannot connect to the database: %v", err)
		}
	}
	return dbConn
}
