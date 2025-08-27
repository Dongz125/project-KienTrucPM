package routes

import (
	"encoding/json"
	"net/http"
)

type HealthResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Service string `json:"service"`
}

func HealthHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Add("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)

	encoder := json.NewEncoder(res)
	encoder.Encode(HealthResponse{http.StatusOK, "Hello, World", "api-gateway"})
}
