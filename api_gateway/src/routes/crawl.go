package routes

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

var proxy *httputil.ReverseProxy

func SetupProxy() {
	if proxy != nil {
		return
	}

	target, err := url.Parse(fmt.Sprintf("http://%s", os.Getenv("CRAWLER_SERVICE")))
	if err != nil {
		log.Fatalln("Can't parse URL for Crawler Service")
		return
	}

	proxy = httputil.NewSingleHostReverseProxy(target)
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		oldPath := req.URL.Path
		req.URL.Path = req.URL.Path[len("/crawl"):]
		log.Printf("Redirecting %s to %s\n", oldPath, req.URL.Path)
	}
}

func CrawlService(w http.ResponseWriter, r *http.Request) {
	SetupProxy()
	proxy.ServeHTTP(w, r)
}
