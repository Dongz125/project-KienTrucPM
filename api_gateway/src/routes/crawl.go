package routes

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

var crawlerProxy *httputil.ReverseProxy

func SetupCrawlerProxy() {
	if crawlerProxy != nil {
		return
	}

	target, err := url.Parse(fmt.Sprintf("http://%s", os.Getenv("CRAWLER_SERVICE")))
	if err != nil {
		log.Fatalln("Can't parse URL for Crawler Service")
		return
	}

	crawlerProxy = httputil.NewSingleHostReverseProxy(target)
	originalDirector := crawlerProxy.Director
	crawlerProxy.Director = func(req *http.Request) {
		originalDirector(req)
		oldPath := req.URL.Path
		req.URL.Path = req.URL.Path[len("/crawl"):]
		log.Printf("Redirecting %s to %s\n", oldPath, req.URL.Path)
	}
}

func CrawlService(w http.ResponseWriter, r *http.Request) {
	SetupCrawlerProxy()
	crawlerProxy.ServeHTTP(w, r)
}
