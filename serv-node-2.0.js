const http = require("http")
const fs = require("fs")
const WebSocketServer = require("websocket").server
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
    type: "message",
    value: "Hello !",
    from: "server"
}

const deniedPseudoMsg = {
    type: "message",
    value: "<img/src/onerror='alert(`Pseudo déja utilisé. Rechargement de la page.`); location.reload()'>",
    from: "server"
}

function sendJsonMessage(receiver, data) {
    if(typeof data == "string") {
        console.log("string " + data + "\n")
        receiver.sendUTF(data)
    }
    else {
        console.log("object ", data, "\n")
        receiver.sendUTF(JSON.stringify(data))
    }
}

const server = http.createServer((request, result) => { // création du server
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
                fs.readFile(disp.send, {encoding:'utf8'}, (e, d)=>{
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

server.listen(8894, "" , ()=>{
    console.log("Bienvenue sur un chat en ligne à l'adresse 'http://192.168.1.25:8894' ( [ctrl] + clic gauche )\n")
})


wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

let connections = []
let pseudos = []

wsServer.on("request", request => {
    console.log("connection requested.\n")
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
            console.log(`Client ${valueObject.value} connected.\n`)
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
        console.log(`Client ${pseudo} disconnected.\n`)
        for (const [conn, pseudo] of connections) {
            if (pseudo !== null) {
                sendJsonMessage(conn, { type: "message", value: `${pseudo} vient de se déconnecter.`, from: "server" });
            }
        }
    })
})