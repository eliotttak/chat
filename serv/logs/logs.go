package logs

import (
	"fmt"
	"time"

	"gihub.com/eliotttak/chat/serv/colors"
)

type (
	OKs    chan any
	Warns  chan any
	Errors chan any
)

type AllLogs struct {
	OKs    OKs
	Warns  Warns
	Errors Errors
}

// DisplayLogs is an async function that creates 3 goroutines. It displays the logs.
func (l *AllLogs) DisplayLogs() {
	go func() {
		for {
			fmt.Printf("[%sOK%s %s] %v\n\n", colors.BoldGreen, colors.Reset, time.Now(), <-l.OKs)
		}
	}()

	go func() {
		for {
			fmt.Printf("[%sWARN%s %s] %v\n\n", colors.BoldHighIntensityYellow, colors.Reset, time.Now(), <-l.Warns)
		}
	}()

	go func() {
		for {
			fmt.Printf("[%sERROR%s %s] %v\n\n", colors.BoldHighIntensityRed, colors.Reset, time.Now(), <-l.Errors)
		}
	}()
}
