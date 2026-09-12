package wsserv

import (
	"encoding/json"
	"errors"
	"net/http"
	"slices"

	"github.com/eliotttak/go-logs/v2"
	"github.com/gorilla/websocket"
)

const (
	NewUsername = "newUsername"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(_ *http.Request) bool { return true },
}

type MessageToClients struct {
	Content string `json:"content"`
	Sender  string `json:"sender"`
}

func (m MessageToClients) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Content string `json:"content"`
		Sender  string `json:"sender"`
		Type    string `json:"type"`
	}{
		m.Content,
		m.Sender,
		"messageToClients",
	})
}

type MessageFromClient struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

var (
	helloMsg = MessageToClients{
		Content: "Hello",
		Sender:  "server",
	}
	loggedInMsg = MessageToClients{
		Content: "You were successfully logged in.",
		Sender:  "server",
	}
)

type (
	LoggedClient struct {
		Username     string
		SentMessages []MessageFromClient
		Connection   *websocket.Conn
	}

	UnloggedClient struct {
		Connection *websocket.Conn
	}
)

func IsUsernameAvailable(username string, clients []LoggedClient) bool {
	for _, c := range clients {
		if username == c.Username {
			return false
		}
	}
	return true
}

var (
	loggedClients   = []LoggedClient{}
	unloggedClients = []UnloggedClient{}
)

func isClientLogged(conn *websocket.Conn) (bool, error) {
	for _, c := range loggedClients {
		if c.Connection == conn {
			return true, nil
		}
	}

	for _, c := range unloggedClients {
		if c.Connection == conn {
			return false, nil
		}
	}

	return false, errors.New("error checking if client is logged: client not found")
}

func findLoggedClientFromConnection(conn *websocket.Conn) (LoggedClient, error) {
	for _, c := range loggedClients {
		if c.Connection == conn {
			return c, nil
		}
	}
	return LoggedClient{}, errors.New("error finding logged client: client not found")
}

func findUnoggedClientFromConnection(conn *websocket.Conn) (UnloggedClient, error) {
	for _, c := range unloggedClients {
		if c.Connection == conn {
			return c, nil
		}
	}
	return UnloggedClient{}, errors.New("error finding logged client: client not found")
}

func New(port uint16, mainLogger, errLogger *logs.Logger) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		webSocketHandler(w, r, mainLogger, errLogger)
	})
}

func webSocketHandler(w http.ResponseWriter, r *http.Request, mainLogger, errLogger *logs.Logger) {
	mainLogger.Log("Received a request on /ws")
	wsconn, err := upgrader.Upgrade(w, r, w.Header())
	if err != nil {
		errLogger.Logf("Failed to upgrade: %s", err.Error())
		return
	}
	defer wsconn.Close()

	wsconn.WriteJSON(helloMsg)

	unloggedClients = append(unloggedClients, UnloggedClient{wsconn})

	for {
		msgType, p, err := wsconn.ReadMessage()
		if err != nil {
			errLogger.Logf("Failed to read message: %s", err.Error())
		}

		mainLogger.Log(string(p))

		if msgType == websocket.TextMessage {
			mainLogger.Log("This is a text message")
			var msg MessageFromClient
			json.Unmarshal(p, &msg)
			if msg.Type == NewUsername {
				mainLogger.Log("This is a new username")
				if IsUsernameAvailable(msg.Content, loggedClients) {
					mainLogger.Log("The username is available")
					mainLogger.Logf("%#v\n\n%#v", loggedClients, unloggedClients)
					loggedClients = append(loggedClients, LoggedClient{
						Username:     msg.Content,
						SentMessages: []MessageFromClient{},
						Connection:   wsconn,
					})
					unloggedClients = slices.DeleteFunc(unloggedClients, func(client UnloggedClient) bool {
						return client.Connection == wsconn
					})
					mainLogger.Logf("%#v\n\n%#v", loggedClients, unloggedClients)

					wsconn.WriteJSON(loggedInMsg)
				}
			}
		}
	}
}
