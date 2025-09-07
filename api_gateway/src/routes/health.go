package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type ServiceHealth struct {
	Service string `json:"service"`
	Healthy bool   `json:"healthy"`
}

type HealthResponse struct {
	Status   int             `json:"status"`
	Healthy  bool            `json:"healthy"`
	Services []ServiceHealth `json:"services"`
}

var servicesToCheck = []string{
	"DATA_TRANSFORMATION_SERVICE",
	"AUTHENTICATION_SERVICE",
	"CRAWLER_SERVICE",
	"SENTIMENT_ANALYSIS_SERVICE",
}

func CheckHealthOf(service string) bool {
	url := fmt.Sprintf("http://%s/health", os.Getenv(service))
	fmt.Println("Checking", url)
	client := http.Client{Timeout: 3 * time.Second}
	res, err := client.Get(url)
	if err != nil {
		return false
	}

	defer res.Body.Close()
	return res.StatusCode == http.StatusOK
}

func HealthHandler(res http.ResponseWriter, req *http.Request) {
	// What to do here?
	var wg sync.WaitGroup
	results := make(chan ServiceHealth, len(servicesToCheck))

	for _, service := range servicesToCheck {
		wg.Add(1)
		go func(name string) {
			defer wg.Done()
			if CheckHealthOf(name) {
				results <- ServiceHealth{Service: strings.ToLower(name), Healthy: true}
			} else {
				results <- ServiceHealth{Service: strings.ToLower(name), Healthy: false}
			}
		}(service)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	statuses := []ServiceHealth{}
	for service := range results {
		statuses = append(statuses, service)
	}

	res.Header().Add("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)

	encoder := json.NewEncoder(res)
	encoder.Encode(HealthResponse{Status: http.StatusOK, Healthy: true, Services: statuses})
}
