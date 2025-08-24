package routes

import (
	"net/http"

	"luny.dev/api-gateway/src/middlewares"
)

func PipeCandlesRequest(req http.Request) {
	if !middlewares.CheckAuthenticaion(req) {
		// Uh oh
	}

	// Pipe right through
}
