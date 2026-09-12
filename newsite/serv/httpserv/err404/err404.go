package err404

import (
	"os"
	"path/filepath"
	"regexp"

	"gitlab.com/eliotttak/chat/newsite/serv/config"
	"gitlab.com/eliotttak/chat/newsite/serv/httpserv/err500"
)

var pathComment = regexp.MustCompile(`<!--(.|\n)*?\{\{PATH\}\}(.|\n)*?-->`)

func Get404(path string) []byte {
	var exeDir string
	{
		var err error
		exeDir, err = config.FindExeDir()
		if err != nil {
			return err500.Get500()
		}
	}

	var entirePath string
	{
		var err error
		entirePath, err = filepath.Abs(filepath.Join(
			exeDir,
			config.Config.Public,
			config.Config.Error404,
		))
		if err != nil {
			return err500.Get500()
		}
	}

	{
		content, err := os.ReadFile(entirePath)
		if err != nil {
			return err500.Get500()
		}

		result := pathComment.ReplaceAll(content, []byte(" : "+path))

		return result
	}
}
