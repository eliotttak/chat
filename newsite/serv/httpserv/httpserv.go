package httpserv

import (
	"fmt"
	"log"
	"mime"
	"net/http"
	"net/http/httputil"
	"os"
	"path/filepath"
	"strings"

	"github.com/eliotttak/go-logs/v2"
	"gitlab.com/eliotttak/chat/newsite/serv/config"
	"gitlab.com/eliotttak/chat/newsite/serv/httpserv/err404"
)

// New creates a new HTTP server
func New(port uint16, mainLogger *logs.Logger, errLogger *logs.Logger) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		httpServRoot(w, r, mainLogger, errLogger)
	})
	mainLogger.Log("Starting the server...")

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	errLogger.Logf("An error occured: %v", err.Error())
}

func existsIsDir(path string) (exists bool, newPath string, err error) {
	stat, e := os.Stat(path)
	if e == nil {
		if !stat.IsDir() {
			exists, newPath, err = true, path, nil
		} else {
			return existsIsDir(filepath.Join(path, "index.html"))
		}
	} else if os.IsNotExist(e) {
		exists, newPath, err = false, path, nil
	} else {
		exists, newPath, err = false, path, e
	}
	return
}

func httpServRoot(w http.ResponseWriter, req *http.Request, mainLogger *logs.Logger, errLogger *logs.Logger) {
	exeDir, err := config.FindExeDir()
	if err != nil {
		errLogger.Logf("Failed to find the executable directory: %s", err)
	}
	// publicDir := config.Config.PublicDirectory
	rawRequest, err := httputil.DumpRequest(req, true)
	if err != nil {
		errLogger.Logf("An error occured: %v", err.Error())
		log.Fatal()
	}

	mainLogger.Logf("Received a request:\n\n%s", strings.ReplaceAll(string(rawRequest), "\r\n", "\n"))

	reqPath := filepath.Join(exeDir, config.Config.Public, req.URL.Path)

	exists, finalReqPath, err := existsIsDir(reqPath)
	if err != nil {
		errLogger.Logf("An error occured: %v", err.Error())
		log.Fatal()
	}

	if !exists {
		w.WriteHeader(404)
		w.Write(err404.Get404(req.URL.Path))
		return
	} else {
		for _, privateDir := range config.Config.Private {
			absPrivateDir, err := filepath.Abs(privateDir)
			if err != nil {
				errLogger.Logf("An error occured: %v", err.Error())
				log.Fatal()
			}
			absRequested, err := filepath.Abs(finalReqPath)
			if err != nil {
				errLogger.Logf("An error occured: %v", err.Error())
				log.Fatal()
			}
			if strings.HasPrefix(absRequested, absPrivateDir) {
				w.WriteHeader(403)
				return
			}
		}
		mimeType := mime.TypeByExtension(filepath.Ext(finalReqPath))
		w.Header().Add("Content-Type", mimeType)
		content, err := os.ReadFile(finalReqPath)
		if err != nil {
			errLogger.Logf("An error occured: %v", err.Error())
			log.Fatal()
		}
		w.Write(content)

	}
}
