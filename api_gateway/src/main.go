package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"luny.dev/api-gateway/src/middlewares"
	"luny.dev/api-gateway/src/routes"
)

func main() {
	secretKeyStr := os.Getenv("JWT_SECRET")
	if secretKeyStr == "" {
		log.Fatal("JWT_SECRET environment variable is not set. Please set it and try again.")
	}
	fmt.Println("Got JWT_SECRET", secretKeyStr)

	transformationService := os.Getenv("DATA_TRANSFORMATION_SERVICE")
	if transformationService == "" {
		log.Fatal("DATA_TRANSFORMATION_SERVICE environment variable is not set.")
	}
	fmt.Printf("using data_transformation_service = %s\n", transformationService)

	mux := http.NewServeMux()
	mux.HandleFunc("/fake", middlewares.CORS(routes.FakeJWTHandler))
	mux.HandleFunc("/ws", middlewares.CORS(routes.PipeCandlesRequest))
	mux.HandleFunc("/health", middlewares.CORS(routes.HealthHandler))

	err := http.ListenAndServe(":80", mux)
	if err != nil {
		fmt.Println("error occurred:", err)
	}
}
