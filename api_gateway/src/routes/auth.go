// Package routes
package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]any{
			"message": "Method not allowed",
			"allowed": [...]string{http.MethodPost},
		})
		return
	}

	// How to pipe the request from ${url}/auth/login
	url := os.Getenv("AUTHENTICATION_SERVICE")
	targetURL := fmt.Sprintf("http://%s/api/auth/login", url)

	// Create a new request to the auth service, reusing the body
	req, err := http.NewRequest(http.MethodPost, targetURL, r.Body)
	if err != nil {
		http.Error(w, `{"message":"failed to create request"}`, http.StatusInternalServerError)
		return
	}

	req.Header = r.Header.Clone()

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, `{"message":"authentication service unreachable"}`, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Copy response status code and body back to client
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]any{
			"message": "Method not allowed",
			"allowed": [...]string{http.MethodPost},
		})
		return
	}

	// How to pipe the request from ${url}/auth/login
	url := os.Getenv("AUTHENTICATION_SERVICE")
	targetURL := fmt.Sprintf("http://%s/api/auth/register", url)

	// Create a new request to the auth service, reusing the body
	req, err := http.NewRequest(http.MethodPost, targetURL, r.Body)
	if err != nil {
		http.Error(w, `{"message":"failed to create request"}`, http.StatusInternalServerError)
		return
	}

	req.Header = r.Header.Clone()

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, `{"message":"authentication service unreachable"}`, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Copy response status code and body back to client
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]any{
			"message": "Method not allowed",
			"allowed": [...]string{http.MethodPost},
		})
		return
	}

	// How to pipe the request from ${url}/auth/login
	url := os.Getenv("AUTHENTICATION_SERVICE")
	targetURL := fmt.Sprintf("http://%s/api/auth/logout", url)

	// Create a new request to the auth service, reusing the body
	req, err := http.NewRequest(http.MethodPost, targetURL, r.Body)
	if err != nil {
		http.Error(w, `{"message":"failed to create request"}`, http.StatusInternalServerError)
		return
	}

	req.Header = r.Header.Clone()

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, `{"message":"authentication service unreachable"}`, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Copy response status code and body back to client
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func RefreshHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]any{
			"message": "Method not allowed",
			"allowed": [...]string{http.MethodPost},
		})
		return
	}

	// How to pipe the request from ${url}/auth/login
	url := os.Getenv("AUTHENTICATION_SERVICE")
	targetURL := fmt.Sprintf("http://%s/api/auth/refresh", url)

	// Create a new request to the auth service, reusing the body
	req, err := http.NewRequest(http.MethodPost, targetURL, r.Body)
	if err != nil {
		http.Error(w, `{"message":"failed to create request"}`, http.StatusInternalServerError)
		return
	}

	req.Header = r.Header.Clone()

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, `{"message":"authentication service unreachable"}`, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Copy response status code and body back to client
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
