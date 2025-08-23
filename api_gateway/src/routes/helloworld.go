package routes

import (
	"io"
	"net/http"
)

func GetHelloWorld(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, "Hello, World!")
}
