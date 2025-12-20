package colors

import "fmt"

type AnsiColor string

const Reset AnsiColor = "\033[0m"

const (
	RegularBlack  AnsiColor = "\033[0;30m"
	RegularRed    AnsiColor = "\033[0;31m"
	RegularGreen  AnsiColor = "\033[0;32m"
	RegularYellow AnsiColor = "\033[0;33m"
	RegularBlue   AnsiColor = "\033[0;34m"
	RegularPurple AnsiColor = "\033[0;35m"
	RegularCyan   AnsiColor = "\033[0;36m"
	RegularWhite  AnsiColor = "\033[0;37m"
)

const (
	BoldBlack  AnsiColor = "\033[1;30m"
	BoldRed    AnsiColor = "\033[1;31m"
	BoldGreen  AnsiColor = "\033[1;32m"
	BoldYellow AnsiColor = "\033[1;33m"
	BoldBlue   AnsiColor = "\033[1;34m"
	BoldPurple AnsiColor = "\033[1;35m"
	BoldCyan   AnsiColor = "\033[1;36m"
	BoldWhite  AnsiColor = "\033[1;37m"
)

const (
	UnderlineBlack  AnsiColor = "\033[4;30m"
	UnderlineRed    AnsiColor = "\033[4;31m"
	UnderlineGreen  AnsiColor = "\033[4;32m"
	UnderlineYellow AnsiColor = "\033[4;33m"
	UnderlineBlue   AnsiColor = "\033[4;34m"
	UnderlinePurple AnsiColor = "\033[4;35m"
	UnderlineCyan   AnsiColor = "\033[4;36m"
	UnderlineWhite  AnsiColor = "\033[4;37m"
)

const (
	BackgroundBlack  AnsiColor = "\033[40m"
	BackgroundRed    AnsiColor = "\033[41m"
	BackgroundGreen  AnsiColor = "\033[42m"
	BackgroundYellow AnsiColor = "\033[43m"
	BackgroundBlue   AnsiColor = "\033[44m"
	BackgroundPurple AnsiColor = "\033[45m"
	BackgroundCyan   AnsiColor = "\033[46m"
	BackgroundWhite  AnsiColor = "\033[47m"
)

const (
	HighIntensityBlack  AnsiColor = "\033[0;90m"
	HighIntensityRed    AnsiColor = "\033[0;91m"
	HighIntensityGreen  AnsiColor = "\033[0;92m"
	HighIntensityYellow AnsiColor = "\033[0;93m"
	HighIntensityBlue   AnsiColor = "\033[0;94m"
	HighIntensityPurple AnsiColor = "\033[0;95m"
	HighIntensityCyan   AnsiColor = "\033[0;96m"
	HighIntensityWhite  AnsiColor = "\033[0;97m"
)

const (
	BoldHighIntensityBlack  AnsiColor = "\033[1;90m"
	BoldHighIntensityRed    AnsiColor = "\033[1;91m"
	BoldHighIntensityGreen  AnsiColor = "\033[1;92m"
	BoldHighIntensityYellow AnsiColor = "\033[1;93m"
	BoldHighIntensityBlue   AnsiColor = "\033[1;94m"
	BoldHighIntensityPurple AnsiColor = "\033[1;95m"
	BoldHighIntensityCyan   AnsiColor = "\033[1;96m"
	BoldHighIntensityWhite  AnsiColor = "\033[1;97m"
)

const (
	HighIntensityBackgroundBlack  AnsiColor = "\033[0;100m"
	HighIntensityBackgroundRed    AnsiColor = "\033[0;101m"
	HighIntensityBackgroundGreen  AnsiColor = "\033[0;102m"
	HighIntensityBackgroundYellow AnsiColor = "\033[0;103m"
	HighIntensityBackgroundBlue   AnsiColor = "\033[0;104m"
	HighIntensityBackgroundPurple AnsiColor = "\033[0;105m"
	HighIntensityBackgroundCyan   AnsiColor = "\033[0;106m"
	HighIntensityBackgroundWhite  AnsiColor = "\033[0;107m"
)

func Print(color AnsiColor, a ...any) {
	fmt.Print(color)
	fmt.Print(a...)
	fmt.Print(Reset)
}

func Printf(color AnsiColor, format string, a ...any) {
	fmt.Print(color)
	fmt.Printf(format, a...)
	fmt.Print(Reset)
}

func Println(color AnsiColor, a ...any) {
	fmt.Print(color)
	fmt.Print(a...)
	fmt.Println(Reset)
}

func Sprint(color AnsiColor, a ...any) string {
	r := ""
	r += fmt.Sprint(color)
	r += fmt.Sprint(a...)
	r += fmt.Sprint(Reset)
	return r
}

func Sprintf(color AnsiColor, format string, a ...any) string {
	r := ""
	r += fmt.Sprint(color)
	r += fmt.Sprintf(format, a...)
	r += fmt.Sprint(Reset)
	return r
}

func Sprintln(color AnsiColor, a ...any) string {
	r := ""
	r += fmt.Sprint(color)
	r += fmt.Sprint(a...)
	r += fmt.Sprintln(Reset)
	return r
}
