const wst = new WebSocket("ws://" + location.host)

const technicalErrors = {
    userAlreadyFound: 1001
}

function sendJsonMessage(wskt, data) {
    if (typeof data === "string") {
        wskt.send(data);
    } else {
        wskt.send(JSON.stringify(data));
    }
}

function sendPseudo(valueText) {
    debugger
    const valueObject = {
        type: "newPseudo",
        value: valueText
    };
    sendJsonMessage(wst, valueObject)
    return valueText
    
}

function sendMessage() {
    debugger
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