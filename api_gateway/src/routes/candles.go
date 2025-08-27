package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"luny.dev/api-gateway/src/middlewares"
)

type PipeCandlesFailedResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func PipeCandlesRequest(w http.ResponseWriter, r *http.Request) {
	jwt, err := middlewares.CheckAuth(r)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(PipeCandlesFailedResponse{http.StatusUnauthorized, err.Error()})
		return
	}

	// Pipe right through
	target, err := url.Parse(fmt.Sprintf("%s?user=%s", os.Getenv("DATA_TRANSFORMATION_SERVICE"), jwt.UserID))
	if err != nil {
		http.Error(w, "Internal server error: Invalid target URL", http.StatusInternalServerError)
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(target)
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = target.Host
		req.Header.Del("Authorization")
		req.Header.Set("X-User-ID", jwt.UserID)
	}

	proxy.ServeHTTP(w, r)
}
