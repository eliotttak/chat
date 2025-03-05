const http = require("http")
const fs = require("fs")
const colors = require("colors/safe")
const WebSocketServer = require("websocket").server
const wsVersion = 2
//const httpVersion = 1
const httpPort = 8894

const technicalErrors = {
    userAlreadyFound: 1001
}

const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const randomArray = (...values) => values[randomRange(1, values.length) - 1]

const randomString = (strLength) => {
    let finalRandomString = ""
    for (let x = 1 ; x <= strLength ; x++) {
        possibleNumber = randomRange(0, 9)
        possibleUpperCase = String.fromCharCode(randomRange(65, 90))
        possibleLowerCase = String.fromCharCode(randomRange(97, 122))
        finalRandomString += randomArray(possibleNumber, possibleLowerCase, possibleUpperCase)
    }
    return finalRandomString
}

const publicFiles = [
    "/",
    "/images/send-message-click.svg",
    "/images/send-message-no-click.svg",
    "/events.js",
    "/favicon.ico",
    "/index.html",
    "/loggedInPage-onlyIdContent.html",
    "/main.js",
    "/style.css",
    "/webSocket.js",
    "/images/403 error.png"
]

const helloMsg = {
    type: "messageToClient",
    value: "Salut !",
    sender: "server"
}

const deniedPseudoMsg = {
    type: "technicalError",
    value: technicalErrors.userAlreadyFound,
    sender: "server"
}

function sendJsonMessage(receiver, data) {
    const pseudo = connections[connections.findConnectionIndex(receiver)].pseudo
    if (typeof data == "string") {
        try {
            const dataAsObj = JSON.parse(data)
            console.log(`\n\nThe client '${dispPseudo(pseudo)}' will receive a JSON with this content :`)
            for (key in dataAsObj) {
                console.log(`    - ${dispJSONKey(key)} : ${key === "value" && dataAsObj.type.startsWith("message") ? dispMessage(dataAsObj[key]) : dispJSONValue(dataAsObj[key])}`)
            }
            console.log("\n\n")
            
        }
        catch(e) {
            console.log(`'${data}'`)
        }
        receiver.sendUTF(data)
    }
    else {
        console.log(pseudo, "object ", data, "\n")
        receiver.sendUTF(JSON.stringify(data))
    }
}

const dispPseudo = pseudo => colors.blue(pseudo)
const dispMessage = message => colors.cyan(message)
const dispURL = url => colors.brightYellow(colors.underline(url))
const dispJSONKey = JSONKey => colors.green(JSONKey)
const dispJSONValue = JSONValue => colors.yellow(colors.underline(JSONValue))
const dispUndefined = () => colors.grey(undefined)

console.log("Légende :", dispPseudo("pseudo"), dispMessage("message"), dispURL("URL"), dispJSONKey("JSON key"), dispJSONValue("JSON value"), dispUndefined())

const localIPv4 = (
    function () {
        var interfaces = require('os').networkInterfaces()
        for (var devName in interfaces) {
            var iface = interfaces[devName];
      
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i]
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address
                }
            }
        }
        return '0.0.0.0'
    }
)()


const server = http.createServer((request, result) => { // HTTP server creating...
    const name = decodeURIComponent(request.url)
    //console.log(name)
    let path = __dirname+(name)
    let segments = path.split(/\//)
    let lastSegment = segments[segments.length - 1]
    if (! /\./.test(lastSegment)) { // si la requete est un dossier
        path = /\/$/.test(path) ? path + "index.html" : path + "/index.html" // ajout d'un "index.html"
    }
    expens =  path.split(/\./)[path.split(/\./).length-1].toLowerCase()
    fs.readFile(path, expens == "js" || expens == "html" || expens == "htm" || expens == "css" || expens == "svg" ? {encoding : "utf-8"} : {}, (err, data) => {
        if (err) {
            let disp = {
                status : "ERROR",
                url : path.replaceAll("/home/elapp/", ""),
                code : 404,
                datetime : new Date().toString(),
                //send : "./404-error.html", 
            }
            result.statusCode = disp.code
            if (request.url.split(".")[request.url.split(".").length - 1] == "html") {
                disp.send = "./404-error.html"
                result.setHeader("Content-Type", "text/html")
                fs.readFile(disp.send, {encoding : "utf-8"}, (mistake, datas) =>{
                    result.end(datas)
                })
            }
            else {
                result.setHeader("Content-Type", "text/javascript")
                disp.send = `console.log("${disp}")`
                result.end(disp.send)
            }
            console.table(disp)
            console.log()
            //fs.readFile(disp.send, {encoding : "utf-8"}, (mistake, datas) =>{
                //result.end(datas)
            //})
        }
        else {
            let type
            switch (path.split(/\./)[path.split(/\./).length-1].toLowerCase()) {
                case "htm":
                case "html":
                    type = "text/html"
                    break
                case "js":
                    type = "application/javascript"
                    break
                case "css":
                    type = "text/css"
                    break
                case "ico":
                    type = "image/x-icon"
                    break
                case "json":
                    type = "application/json"
                    break
                case "jpg":
                case "jpeg":
                    type = "image/jpeg"
                    break
                case "png":
                    type = "image/png"
                    break
                case "svg":
                    type = "image/svg+xml"
                    break
            }
            if (!(publicFiles.includes(name))){
                let disp = {
                    status : "ERROR",
                    url : name,
                    datetime : new Date().toString(),
                    code : 403,
                    type : type,
                    send : "403-error.html"
                }

                console.table(disp)
                console.log()
                result.statusCode = disp.code
                fs.readFile(disp.send, {encoding:'utf8'}, (error, d)=>{
                    result.end(d)
                })
                return
            }
            let disp = {
                status : "OK",
                url : name,
                datetime : new Date().toString(),
                code : 200,
                type : type
            }
            console.table(disp)
            console.log()
            result.setHeader("Content-Type", type)
            result.statusCode = disp.code
            result.end(data, "utf8")
        }
    })
})

server.listen(httpPort, "" , ()=>{
    console.log(`Bienvenue sur un chat en ligne à l'adresse '${dispURL(`http://${localIPv4}:${httpPort}`)}' ( [ctrl] + clic gauche )\n`)
})


wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptconnections: false

})

let connections = []
connections.findConnectionIndex = co => connections.findIndex(
    c => (
        co === c
    ) || (
        co === c.wsConnection
    )
)


if (wsVersion === 1) { // The old version that needs to be reworked

    wsServer.on("request", request => {
        console.log("connection requested.\n")
        console.log(request.origin)
        const connection = request.accept(null, request.origin)
        connections.push([connection, null]) // Ajouter la connexion et le pseudo (null pour le moment)
        console.log("Connect accepted\n")
        sendJsonMessage(connection, helloMsg)
    
        connection.on("message", message => {
            const valueObject = JSON.parse(message.utf8Data)
            valueObject.value = valueObject.value.replaceAll("<", "&#60;").replaceAll("\n", "<br />")
            if (valueObject.type === "requestPseudo") {
                const index = connections.findIndex(([conn]) => conn === connection)
                if (valueObject.value == "server" || pseudos.includes(valueObject.value.toLowerCase())) {
                    sendJsonMessage(connections[index][0], deniedPseudoMsg)
                    return
                }
                connections[index][1] = valueObject.value // Mettre à jour le pseudo
                pseudos.push(valueObject.value.toLowerCase())
                console.log(`Client ${dispPseudo(valueObject.value)} connected.\n`)
                for (const [conn, pseudo] of connections) {
                    if (pseudo !== null) {
                        sendJsonMessage(conn, { type: "message", value: `${valueObject.value} vient de se connecter.`, from: "server" });
                    }
                }
            } else {
                for (const [conn, pseudo] of connections) {
                    if (pseudo !== null) {
                        console.log({ ...valueObject, from: pseudo} + "\n")
                        sendJsonMessage(conn, valueObject)
                    }
                }
            }
        })
    
        connection.on("close", () => {
            const index = connections.findIndex(([conn]) => conn === connection)
            const pseudo = connections[index][1]
            connections.splice(index, 1) // Supprimer la connexion de la liste
            console.log(`Client ${dispPseudo(pseudo)} disconnected.\n`)
            for (const [conn, pseudo] of connections) {
                if (pseudo !== null) {
                    sendJsonMessage(conn, { type: "message", value: `${pseudo} vient de se déconnecter.`, from: "server" });
                }
            }
        })
    })
}

else if (wsVersion === 2) { // The new version which is equivalent to the old one, but reworked.

    wsServer.on("request", request => {
        console.log(`A connection was requested by a ${dispURL(request.origin)}'s client.\nWe are verifying that this is a correct URL (the correct URLs are '${dispURL(`http(s)://localhost:${httpPort}`)}' and '${dispURL(`http(s)://${localIPv4}:${httpPort}`)}')...\n`)
        if (! new RegExp("https?:\/\/(localhost|" + localIPv4.replaceAll(".", "\.") + "):" + httpPort).test(request.origin)) {
            console.log("The URL is not correct. The request is rejected.\n")
            request.reject()
            return
        }
        else {
            console.log("The URL is correct. The request is accepted.\n")
            connections.push(
                {
                    wsConnection: request.accept(),
                    pseudo: undefined,
                    numberOfIncorrectMsgs: 0
                    // verificationCode: randomString(12)
                }
            )
            const connection = connections[connections.length - 1]
            sendJsonMessage(connection.wsConnection, helloMsg)

            connection.wsConnection.on("message", msg => {
                try {
                    const usableMsg = JSON.parse(msg.utf8Data)
                    switch (usableMsg.type) {
                        case "newPseudo" :
                            const verifiedPseudo = usableMsg.value.replaceAll("<", "&lt;").replaceAll("\n", "")
                            for (let user of connections) {
                                if (user.pseudo === verifiedPseudo) { // Check if there is already a user with the same pseudo.
                                    sendJsonMessage(connection.wsConnection, deniedPseudoMsg)
                                    return
                                }
                            }
                            connection.pseudo = connection.pseudo === undefined ? verifiedPseudo : connection.pseudo // Modify the pseudo only if it is not saved
                            console.log(`Client ${dispPseudo(connection.pseudo)} connected.`)
                            for (let user of connections) {
                                if (user.pseudo === undefined) {
                                    continue // Don't send anything to the unconnected clients.
                                }
                                sendJsonMessage(user.wsConnection, JSON.stringify({
                                    type: "messageToClients",
                                    sender: "server",
                                    value: `${connection.pseudo} vient de se connecter.`
                                })
                                )
                            }
                            break
                        case "messageToOthers" :
                            for (let user of connections) {
                                if (user.pseudo !== undefined) {
                                    sendJsonMessage(user.wsConnection, {
                                        type: "messageToClients",
                                        sender: connection.pseudo,
                                        value: usableMsg.value.replaceAll("<", "&lt;").replaceAll("\n", "<br />")
                                    })
                                }
                            }
                    }
                }
                catch(error) {
                    connection.numberOfIncorrectMsgs++
                    console.warn(`The user with index n°${connections.indexOf(connection)} almost made an error. This is the ${connection.numberOfIncorrectMsgs}${connection.numberOfIncorrectMsgs.toString().endsWith("1") && connection.numberOfIncorrectMsgs !== 11 ? "st" : (connection.numberOfIncorrectMsgs.toString().endsWith("2") && connection.numberOfIncorrectMsgs !== 12 ? "nd" : (connection.numberOfIncorrectMsgs.toString().endsWith("3") && connection.numberOfIncorrectMsgs !== 13 ? "rd" : "th"))} time he/she has done this.`)
                    if (connection.numberOfIncorrectMsgs === 2) {
                        for (let user of connections) {
                            if (user.pseudo !== undefined) {
                                sendJsonMessage(user.wsConnection, {
                                    type: "messageToClients",
                                    sender: "server",
                                    value: `${connection.pseudo !== undefined ? `${connection.pseudo} a failli causer 2 fois une erreur sur le serveur. Veillez faire attention si vous partagez des informations sensibles, car c'est peut-être un pirate informatique (<i>hacker</i>)` : `Un utilisateur sans pseudo a failli causer 2 fois une erreur sur le serveur. Veillez faire attention si vous partagez des informations sensibles, car c'est peut-être un pirate informatique (<i>hacker</i>)`}`
                                })
                            }
                        }
                    }
                    else if (connection.numberOfIncorrectMsgs === 3) {
                        for (let user of connections) {
                            if (user.pseudo !== undefined) {
                                sendJsonMessage(user.wsConnection, {
                                    type: "messageToClients",
                                    sender: "server",
                                    value: `${connection.pseudo !== undefined ? `${connection.pseudo} a tenté de causer 3 fois une erreur sur le serveur. Il sera déconnecté pour cette raison` : `Un utilisateur sans pseudo a failli causer 2 fois une erreur sur le serveur. Il sera déconnecté pour cette raison.`}`
                                })
                            }
                        }
                        connection.wsConnection.close()
                    }
                }
            })

            connection.wsConnection.on("close", () => {
                /* 1/ Find the connections index in the 'connections' array. */
                const closedIndex = connections.findConnectionIndex(connection)

                /* 2/ Notify users that le client has logged out. */
                for (let user of connections) {
                    if (user.pseudo !== undefined && connection.pseudo !== undefined) {
                        sendJsonMessage(user.wsConnection, {
                            type: "messageToClients",
                            sender: "server",
                            value: `${connection.pseudo} vient de se déconnecter`
                        })
                    }
                }

                /* Delete the connection of the 'connections' array. */
                connections.splice(closedIndex)
            })
        }
    })
}

setInterval(() => {
    /* Sort connections into those with and without pseudo */
    let withPseudo = []
    let withoutPseudo = []
    for (const co of connections) {
        if (co.pseudo === undefined) {
            withoutPseudo.push(co)
        }
        else {
            withPseudo.push(co)
        }
    }

    if (withPseudo.length === 0 && withoutPseudo.length === 0) {
        return
    }

    console.log("\n\nHere are the users who are currently logged in (with and without pseudo) :\n")
    /* Show connections with a pseudo first, then those without a pseudo. */
    let index = 1
    withPseudo.forEach((co, i) => {
        console.log(`${index++} (index ${connections.indexOf(co)} in the array) :`)
        console.log(`    - pseudo : ${dispPseudo(co.pseudo)}
    - numberOfIncorrectsMsgs : ${co.numberOfIncorrectMsgs}`)
        console.log()
    })

    withoutPseudo.forEach((co, i) => {
        console.log(`${index++} (index ${connections.indexOf(co)} in the array) :`)
        console.log(`    - pseudo : ${dispUndefined()}
    - numberOfIncorrectsMsgs : ${co.numberOfIncorrectMsgs}`)
        console.log()
    })

    

}, 10000)