let tempWst

try {
    tempWst = new WebSocket("ws://" + location.host)
}
catch {
    try {
        tempWst = new WebSocket("wss://chat-8518.onrender.com/")
    }
    catch {
        try {
            tempWst = new WebSocket("wss://echat.up.railway.app/")
        }
        catch {
            tempWst = new WebSocket("wss://elchat.netlify.app/")
        }
    }
}

const wst = tempWst

const technicalMessages = {
    fromServer: {
        errors: {
            userAlreadyFound: 1001,
            incorrectPseudo: 1002
        },
        messages: {
            userNotAlreadyFound: 1000
        }
    },
}

/**
 * @description This function send data to the server via a WebSocket instance
 * @param {WebSocket} wskt The WebSocket instance
 * @param {(object|string)} data The data to send. It can be a JSON object or a simple string.
 */
function sendJsonMessage(wskt, data) {
    if (typeof data === "string") {
        wskt.send(data);
    } else {
        wskt.send(JSON.stringify(data));
    }
}

/**
 * @description This function send the user's pseudo to the server.
 * @param {string} valueText The pseudo to send
 * @returns {string} The send pseudo
 */
function sendPseudo(valueText) {
    if (debug == true) {
        debugger
    }   
    const valueObject = {
        type: "newPseudo",
        value: valueText
    };
    sendJsonMessage(wst, valueObject)
    return valueText
    
}

/**
 * @description This function send the message entered by the user
 */
function sendMessage() {
    if (debug == true) {
        debugger
    }
    const valueText = document.getElementById("inputmessage").value
    const valueObject = {
        type: "messageToOthers", 
        value: valueText,
    }
    sendJsonMessage(wst, valueObject)
    document.getElementById("inputmessage").value = ""
}

/**
 * @description This function disconnect the client from the server
 * @param {WebSocket} wskt The WebSocket instance to disconnect
 */
function disconnect(wskt){
    wskt.close()
}