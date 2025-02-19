const http = require("http")
const fs = require("fs")
const { verify } = require("crypto")
const WebSocketServer = require("websocket").server
const wsVersion = 2
const httpPort = 8894

const localIPv4 = (
    function getIPAddress() {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
          var iface = interfaces[devName];
      
          for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
              return alias.address;
          }
        }
        return '0.0.0.0';
      }
)()

const randomRange = (min, max) => Math.ceil(Math.random() * (max - min) + min)

const randomArray = (...values) => values[randomRange(1, values.length) - 1]

const randomString = (strLength) => {
    let finalRandomString = ""
    for (let x = 1 ; x <= strLength ; x++) {
        possibleNumber = randomRange(0, 9)
        possibleUpperCase = String.fromCharCode(randomRange(65, 90))
        possibleLowerCase = String.fromCharCode(randomRange(97, 122))
        finalRandomString += randomArray(possibleLowerCase, possibleNumber, possibleUpperCase)
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

server.listen(httpPort, "" , ()=>{
    console.log(`Bienvenue sur un chat en ligne à l'adresse 'http://${localIPv4}:${httpPort}' ( [ctrl] + clic gauche )\n`)
})


wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptconnexions: false

})

let connexions = []

if (wsVersion === 1) { // The old version that needs to be reworked

    wsServer.on("request", request => {
        console.log("connection requested.\n")
        console.log(request.origin)
        const connection = request.accept(null, request.origin)
        connexions.push([connection, null]) // Ajouter la connexion et le pseudo (null pour le moment)
        console.log("Connect accepted\n")
        sendJsonMessage(connection, helloMsg)
    
        connection.on("message", message => {
            const valueObject = JSON.parse(message.utf8Data)
            valueObject.value = valueObject.value.replaceAll("<", "&#60;").replaceAll("\n", "<br />")
            if (valueObject.type === "requestPseudo") {
                const index = connexions.findIndex(([conn]) => conn === connection)
                if (valueObject.value == "server" || pseudos.includes(valueObject.value.toLowerCase())) {
                    sendJsonMessage(connexions[index][0], deniedPseudoMsg)
                    return
                }
                connexions[index][1] = valueObject.value // Mettre à jour le pseudo
                pseudos.push(valueObject.value.toLowerCase())
                console.log(`Client ${valueObject.value} connected.\n`)
                for (const [conn, pseudo] of connexions) {
                    if (pseudo !== null) {
                        sendJsonMessage(conn, { type: "message", value: `${valueObject.value} vient de se connecter.`, from: "server" });
                    }
                }
            } else {
                for (const [conn, pseudo] of connexions) {
                    if (pseudo !== null) {
                        console.log({ ...valueObject, from: pseudo} + "\n")
                        sendJsonMessage(conn, valueObject)
                    }
                }
            }
        })
    
        connection.on("close", () => {
            const index = connexions.findIndex(([conn]) => conn === connection)
            const pseudo = connexions[index][1]
            connexions.splice(index, 1) // Supprimer la connexion de la liste
            console.log(`Client ${pseudo} disconnected.\n`)
            for (const [conn, pseudo] of connexions) {
                if (pseudo !== null) {
                    sendJsonMessage(conn, { type: "message", value: `${pseudo} vient de se déconnecter.`, from: "server" });
                }
            }
        })
    })
}

else if (wsVersion === 2) { // The new version which is equivalent to the old one, but reworked.

    wsServer.on("request", request => {
        console.log(`A connexion was requested by a ${request.origin}'s client.\nWe are verifying that this is a correct URL (the correct URLs are 'http://localhost:${httpPort}' and 'http://${localIPv4}:${httpPort}')...\n`)
        if (! new RegExp("https?:\/\/(localhost|" + localIPv4.replaceAll(".", "\.") + "):" + httpPort).test(request.origin)) {
            console.log("The URL is not correct. The request is rejected.\n")
            request.reject()
            return
        }
        else {
            console.log("The URL is correct. The request is accepted.\n")
            connexions.push(
                {
                    wsConnexion: request.accept(),
                    pseudo: undefined,
                    verificationCode: randomString(12)
                }
            )
        }
    })
}