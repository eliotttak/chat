package main

import (
	"fmt"
	"os"

	colors "github.com/eliotttak/go-ansi-colors"
	"github.com/eliotttak/go-logs/v2"
	"gitlab.com/eliotttak/chat/newsite/serv/httpserv"
	"gitlab.com/eliotttak/chat/newsite/serv/wsserv"
)

// func greet(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintf(w, "<h1>Hello World! %s</h1>", time.Now())
// }

func main() {
	mainLogger := logs.New().
		SetPrefix(fmt.Sprintf(
			"[%sLOG%s]",
			colors.RegularBlue,
			colors.Reset,
		)).
		SetSuffix("({{{01-02-2006 03:04PM}}})")

	errLogger := logs.New().
		SetPrefix(fmt.Sprintf(
			"[%sERROR%s]",
			colors.RegularRed,
			colors.Reset,
		)).
		SetSuffix(mainLogger.GetSuffix()).
		SetDefaultWriter(os.Stderr)

	wsserv.New(8080, mainLogger, errLogger)
	httpserv.New(8080, mainLogger, errLogger)
}
