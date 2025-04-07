let tempWst

try {
    tempWst = new WebSocket("ws://" + location.host)
}
catch {
    tempWst = new WebSocket("wss://chat-8518.onrender.com/")
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

function sendJsonMessage(wskt, data) {
    if (typeof data === "string") {
        wskt.send(data);
    } else {
        wskt.send(JSON.stringify(data));
    }
}

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

function disconnect(wskt){
    wskt.close()
}