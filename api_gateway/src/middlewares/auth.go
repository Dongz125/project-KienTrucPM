package middlewares

import "net/http"

func CheckAuthenticaion(req http.Request) bool {
	// JWT auth check

	return true
}
