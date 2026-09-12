package err500

import "fmt"

func Get500() []byte {
	return fmt.Appendf([]byte{}, "<h1>Internal server error</h1>")
}
