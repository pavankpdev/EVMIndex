package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math/big"
	"strconv"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/pavankpdev/EVMIndex/core/db"
	sqlc "github.com/pavankpdev/EVMIndex/core/db/sqlc"
	"golang.org/x/crypto/sha3"

	_ "github.com/lib/pq"
)

var (
	store *sqlc.Queries
	conn *sql.DB
	once   sync.Once
)

func initDB() {
	once.Do(func() {
		conn = db.GetDbConnection()
		store = sqlc.New(conn)
		fmt.Println("✅ Database connection initialized")
	})
}

func main() {
	initDB()
	defer conn.Close()

	rpcURL := "wss://polygon-amoy.g.alchemy.com/v2/e5X5TCL-0GBdm_iP9LnsNskTgeAHPHrS"

	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		log.Fatalf("Failed to connect to Ethereum WebSocket: %v", err)
	}
	defer client.Close()

	events, err := store.GetAllEventConfigs(context.Background())
	if err != nil {
		log.Fatalf("Failed to fetch event configs: %v", err)
		return
	}

	var wg sync.WaitGroup

	for _, e := range events {
		wg.Add(1)

		go func(event sqlc.EventConfig) {
			defer wg.Done()
			fmt.Printf("\n🔄 Processing Event ID: %s, Contract: %s\n", event.ID, event.Contract.String)

			contractAddress := common.HexToAddress(event.Contract.String)
			startBlock := uint64(event.StartBlock.Int32)

			eventTopic := getEventTopic(event.Structure.String)

			// Run historical sync
			fmt.Printf("📜 Running historical sync for Event ID: %s\n", event.ID)
			fetchHistoricalEvents(client, contractAddress, eventTopic, startBlock)

			// Run live event listener
			fmt.Printf("🚀 Starting live sync for Event ID: %s\n", event.ID)
			listenForLiveEvents(client, contractAddress, eventTopic)

		}(e)
	}

	wg.Wait() // Wait for all goroutines to complete
}

func getEventTopic(eventSignature string) common.Hash {
	hash := sha3.NewLegacyKeccak256()
	hash.Write([]byte(eventSignature))
	return common.BytesToHash(hash.Sum(nil))
}

func fetchHistoricalEvents(client *ethclient.Client, contract common.Address, topic common.Hash, startBlock uint64) {
	header, err := client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to fetch latest block: %v", err)
	}
	latestBlock := header.Number.Uint64()

	query := ethereum.FilterQuery{
		FromBlock: big.NewInt(int64(startBlock)),
		ToBlock:   big.NewInt(int64(latestBlock)),
		Addresses: []common.Address{contract},
		Topics:    [][]common.Hash{{topic}},
	}

	logs, err := client.FilterLogs(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to fetch logs: %v", err)
	}

	fmt.Println("📌 Historical Events:")
	for _, logEntry := range logs {
		processEvent(client, logEntry)
	}
	fmt.Println("✅ Historical sync completed.")
}

func listenForLiveEvents(client *ethclient.Client, contract common.Address, topic common.Hash) {
	query := ethereum.FilterQuery{
		Addresses: []common.Address{contract},
		Topics:    [][]common.Hash{{topic}},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		log.Fatalf("Failed to subscribe to live logs: %v", err)
	}

	fmt.Println("\n🚀 Listening for Live Events...")
	for {
		select {
		case err := <-sub.Err():
			log.Fatalf("Subscription error: %v", err)
		case logEntry := <-logs:
			processEvent(client, logEntry)
		}
	}
}

func processEvent(client *ethclient.Client, logEntry types.Log) {
	fmt.Println("----------------------------------------------------")
	fmt.Printf("Block: %d\nTx: %s\n", logEntry.BlockNumber, logEntry.TxHash.Hex())

	block, err := client.BlockByNumber(context.Background(), big.NewInt(int64(logEntry.BlockNumber)))
	if err != nil {
		log.Printf("Failed to fetch block details: %v", err)
		return
	}

	timestamp := time.Unix(int64(block.Time()), 0)
	fmt.Printf("Timestamp: %s\n", timestamp.Format(time.RFC3339))

	operator := common.HexToAddress(logEntry.Topics[1].Hex())
	to := common.HexToAddress(logEntry.Topics[2].Hex())
	tokenID := new(big.Int).SetBytes(logEntry.Topics[3].Bytes())

	fmt.Printf("Operator: %s\n", operator.Hex())
	fmt.Printf("To: %s\n", to.Hex())
	fmt.Printf("TokenIn: %s\n", tokenID.String())

	go storeEvent(logEntry, timestamp, operator, to, tokenID)
}

func storeEvent(logEntry types.Log, timestamp time.Time, operator, to common.Address, tokenID *big.Int) {
	err := store.InsertEventLog(context.Background(), sqlc.InsertEventLogParams{
		BlockNumber: strconv.FormatUint(logEntry.BlockNumber, 10),
		TxHash:      logEntry.TxHash.Hex(),
		Timestamp:   timestamp,
		From:        operator.Hex(),
		To:          to.Hex(),
		TokenID:     tokenID.String(),
	})
	if err != nil {
		log.Printf("❌ Failed to store event log: %v", err)
	} else {
		fmt.Println("✅ Event log stored successfully!")
	}
}
