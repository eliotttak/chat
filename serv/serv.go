package main

import (
	"gihub.com/eliotttak/chat/serv/httpserv"
	"gihub.com/eliotttak/chat/serv/logs"
)

// func greet(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintf(w, "<h1>Hello World! %s</h1>", time.Now())
// }

func main() {
	allHttpLogs := logs.AllLogs{
		OKs:    make(logs.OKs),
		Warns:  make(logs.Warns),
		Errors: make(logs.Errors),
	}
	allHttpLogs.DisplayLogs()

	allHttpLogs.OKs <- "TEST OK"
	allHttpLogs.Warns <- "TEST WARN"
	allHttpLogs.Errors <- "TEST ERROR"

	httpserv.CreateServ(8080, allHttpLogs)

}
