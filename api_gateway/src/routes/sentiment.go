package routes

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

var sentimentProxy *httputil.ReverseProxy

func SetupSentimentProxy() {
	if sentimentProxy != nil {
		return
	}

	target, err := url.Parse(fmt.Sprintf("http://%s", os.Getenv("SENTIMENT_ANALYSIS_SERVICE")))
	if err != nil {
		log.Fatalln("Can't parse URL for Sentiment Analysis Service")
		return
	}

	sentimentProxy = httputil.NewSingleHostReverseProxy(target)
	originalDirector := sentimentProxy.Director
	sentimentProxy.Director = func(req *http.Request) {
		originalDirector(req)
		oldPath := req.URL.Path
		req.URL.Path = req.URL.Path[len("/sentiment"):]
		log.Printf("Redirecting %s to %s\n", oldPath, req.URL.Path)
	}
}

func SentimentService(w http.ResponseWriter, r *http.Request) {
	SetupSentimentProxy()
	sentimentProxy.ServeHTTP(w, r)
}
