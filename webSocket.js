const wst = new WebSocket("ws://192.168.1.25:8894")



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
        type: "requestPseudo",
        value: valueText
    };
    sendJsonMessage(wst, valueObject)
    return valueText
    
}

function sendMessage() {
    debugger
    const valueText = document.getElementById("inputmessage").value
    const valueObject = {
        type: "message", 
        value: valueText,
        from: pseudo
    }
    sendJsonMessage(wst, valueObject)
    document.getElementById("inputmessage").value = ""
}

function disconnect(wskt){
    wskt.close()
}