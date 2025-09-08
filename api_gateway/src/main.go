package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"luny.dev/api-gateway/src/middlewares"
	"luny.dev/api-gateway/src/routes"
)

func CheckEnvironmentValue(val string) {
	key := os.Getenv(val)
	if key == "" {
		log.Fatalf("%s environment variable is not set. Please set it and try again.\n", val)
	}
	fmt.Printf("Using %s = %s\n", val, key)
}

func main() {
	CheckEnvironmentValue("JWT_SECRET")
	CheckEnvironmentValue("DATA_TRANSFORMATION_SERVICE")
	CheckEnvironmentValue("AUTHENTICATION_SERVICE")
	CheckEnvironmentValue("BACKTESTING_SERVICE")
	CheckEnvironmentValue("CRAWLER_SERVICE")
	CheckEnvironmentValue("SENTIMENT_ANALYSIS_SERVICE")

	mux := http.NewServeMux()
	mux.HandleFunc("/fake", middlewares.CORS(routes.FakeJWTHandler))
	mux.HandleFunc("/ws", middlewares.CORS(routes.PipeCandlesRequest))
	mux.HandleFunc("/health", middlewares.CORS(routes.HealthHandler))
	mux.HandleFunc("/login", middlewares.CORS(routes.LoginHandler))
	mux.HandleFunc("/register", middlewares.CORS(routes.RegisterHandler))
	mux.HandleFunc("/refresh", middlewares.CORS(routes.RefreshHandler))
	mux.HandleFunc("/logout", middlewares.CORS(routes.LogoutHandler))
	mux.HandleFunc("/crawl/", middlewares.CORS(routes.CrawlService))
	mux.HandleFunc("/sentiment/", middlewares.CORS(routes.SentimentService))

	fmt.Println("Starting API Gateway")
	err := http.ListenAndServe(":80", mux)
	if err != nil {
		fmt.Println("error occurred:", err)
	}
}
