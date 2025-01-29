package main

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"golang.org/x/crypto/sha3"
)

func main() {
	// WebSocket URL for live event listening
	rpcURL := "wss://polygon-amoy.g.alchemy.com/v2/e5X5TCL-0GBdm_iP9LnsNskTgeAHPHrS"

	// Connect to Ethereum WebSocket node
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		log.Fatalf("Failed to connect to Ethereum WebSocket: %v", err)
	}
	defer client.Close()

	// Contract details
	contractAddress := common.HexToAddress("0x31Ef6675B147bFCa2ab7dF6462547110c98F0B00")
	startBlock := uint64(5810517)

	eventSignature := "Transfer(address,address,uint256)"
	hash := sha3.NewLegacyKeccak256()
	hash.Write([]byte(eventSignature))
	eventTopic_ := hash.Sum(nil)

	// Define event topic hash for Issued(address,address,uint256)
	eventTopic := common.BytesToHash(eventTopic_)

	// Fetch historical events
	fetchHistoricalEvents(client, contractAddress, eventTopic, startBlock)

	// Start listening for live events
	listenForLiveEvents(client, contractAddress, eventTopic)
}

// Fetch historical events
func fetchHistoricalEvents(client *ethclient.Client, contract common.Address, topic common.Hash, startBlock uint64) {
	// Fetch latest block number
	header, err := client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to fetch latest block: %v", err)
	}
	latestBlock := header.Number.Uint64()

	// Query logs
	query := ethereum.FilterQuery{
		FromBlock: big.NewInt(int64(startBlock)),
		ToBlock:   big.NewInt(int64(latestBlock)),
		Addresses: []common.Address{contract},
		Topics:    [][]common.Hash{{topic}}, // Filter `Issued` events
	}

	// Fetch logs
	logs, err := client.FilterLogs(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to fetch logs: %v", err)
	}

	// Process logs
	fmt.Println("📌 Historical Events:")
	for _, logEntry := range logs {
		printEvent(client, logEntry)
	}
}

// Listen for live events using WebSockets
func listenForLiveEvents(client *ethclient.Client, contract common.Address, topic common.Hash) {
	// Subscribe to live event logs
	query := ethereum.FilterQuery{
		Addresses: []common.Address{contract},
		Topics:    [][]common.Hash{{topic}}, // Filter `Issued` events
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
			printEvent(client, logEntry)
		}
	}
}

// Print event details
func printEvent(client *ethclient.Client, logEntry types.Log) {
	fmt.Println("----------------------------------------------------")
	fmt.Printf("Block: %d\nTx: %s\n", logEntry.BlockNumber, logEntry.TxHash.Hex())

	// Fetch block details to get timestamp
	block, err := client.BlockByNumber(context.Background(), big.NewInt(int64(logEntry.BlockNumber)))
	if err != nil {
		log.Printf("Failed to fetch block details: %v", err)
		return
	}

	// Convert timestamp
	timestamp := time.Unix(int64(block.Time()), 0)
	fmt.Printf("Timestamp: %s\n", timestamp.Format(time.RFC3339))

	// Parse indexed parameters
	operator := common.HexToAddress(logEntry.Topics[1].Hex())
	to := common.HexToAddress(logEntry.Topics[2].Hex())
	tokenID := new(big.Int).SetBytes(logEntry.Topics[3].Bytes())

	fmt.Printf("Operator: %s\n", operator.Hex())
	fmt.Printf("To: %s\n", to.Hex())
	fmt.Printf("TokenIn: %s\n", tokenID.String())
}
