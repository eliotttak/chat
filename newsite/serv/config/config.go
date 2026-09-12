package config

import (
	"os"
	"path/filepath"
)

type ConfigType struct {
	Public   string
	Private  []string
	Error404 string
}

var Config = ConfigType{
	Public:   "..",
	Private:  []string{"."},
	Error404: "/errors/404/404.html",
}

func FindExeDir() (string, error) {
	exePathWithSymlink, err := os.Executable()
	if err != nil {
		return "", err
	}

	exePath, err := filepath.EvalSymlinks(exePathWithSymlink)
	if err != nil {
		return "", err
	}

	return filepath.Dir(exePath), nil
}
