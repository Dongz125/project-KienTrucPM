package main

import (
	"fmt"
	"net/http"

	"luny.dev/api-gateway/src/middlewares"
	"luny.dev/api-gateway/src/routes"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", middlewares.CORS(routes.GetHelloWorld))

	err := http.ListenAndServe(":80", mux)
	if err != nil {
		fmt.Println("Error occurred:", err)
	}
}
