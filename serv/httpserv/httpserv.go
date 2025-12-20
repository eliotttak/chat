package httpserv

import (
	"fmt"
	"net/http"

	"gihub.com/eliotttak/chat/serv/logs"
)

func CreateServ(port int16 /* Not sure it can't be negative */, logs logs.AllLogs) {
	http.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) { httpServRoot(w, r, logs) })
	logs.OKs <- "Starting the server..."

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	logs.Errors <- "An error occured: " + err.Error()
}

// type computedURI

// func computeURI() {}

func httpServRoot(w http.ResponseWriter, req *http.Request, logs logs.AllLogs) {
	logs.OKs <- "Received a request: " + req.RequestURI
	// logs.OKs <- req.ContentLength

	w.Write([]byte("<h1>Hello!</h1>"))

	// reqURI := reqURL.RequestURI()
}
