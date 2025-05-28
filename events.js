window.addEventListener("beforeunload", function (e) {
    dontSendUnconnectNotifs = true
    disconnect(wst)
});

idOkpseudo.on("click", e => {
    pseudo = idInputpseudo.val()
    if (/^\s*$/.test(pseudo)) {
        putErrorUnderTextInput(idInputpseudo, {
            txt: "Votre pseudo est vide ou ne contient que des espaces. Merci de recommencer.",
            showTime: 5000
        })
        return
    }
    sendPseudo(pseudo)
})

idInputpseudo.on("input", evt => {
    let value = idInputpseudo.val()
    if (/[^-\._A-Za-z0-9À-ÖÙ-ÿ]/.test(value[value.length - 1])) {
        putErrorUnderTextInput(idInputpseudo, {
            txt: `Le caractère <span style="color: #FF0000;">${value[value.length - 1] === " " ? "Espace" : (value[value.length - 1] === "\t" ? "Tabulation" : (value[value.length - 1] === "\n" ? "Saut de ligne" : value[value.length - 1]))}</span> n'est pas autorisé.`,
            color: "#000000",
            showTime: 5000
        })
        idInputpseudo.val(value.substr(0, value.length - 1))
    }
    
    if (value.length > 16) {
        putErrorUnderTextInput(idInputpseudo, {
            txt: `La longueur du pseudo est limitée à 16 caractères.`,
            showTime: 5000
        })
        while (value.length > 16) {
            idInputpseudo.val(value.substr(0, value.length - 1))
            value = idInputpseudo.val()
            
        }
    }
    
})

document.addEventListener("keydown", evt => {
    console.log("keydown")
    if (evt.key == "Enter") {
        console.log("evt.key == 'Enter'")
        if (page == 0) {
            console.log("page == 0")
            document.getElementById("okpseudo").click()
        }
        else if (page === 1) {
            console.log("page === 1")
            if (evt.ctrlKey) {
                document.getElementById("okmessage").click()
            }
        }
    }
})

wst.addEventListener("open", () => {
    console.log('WebSocket connection established.')
})

wst.addEventListener("message", (evt) => {
    const valueObject = JSON.parse(evt.data)
    console.log(valueObject)
    if (/messageToClients?/.test(valueObject.type)) {
        console.log("It's a message to the client(s). Displaying...")
        if (valueObject.sender == "server") {
            document.getElementById("messages").innerHTML += `<span class="fromServer">${valueObject.value}</span><br/><br />`
        }
        else {
            document.getElementById("messages").innerHTML += `<span class="pseudoLabel">&nbsp;${valueObject.sender} </span>&nbsp;<span class="message">&nbsp;${valueObject.value.replaceAll("<br />", "&nbsp;<br />&nbsp;")}&nbsp;</span><br/><br />`
        }
    }
    else if (valueObject.type === "technicalError") {
        switch (valueObject.value) {
            case technicalMessages.fromServer.errors.userAlreadyFound:
                putErrorUnderTextInput(idInputpseudo, {
                    txt: "Ce pseudo déjà utilisé. Merci de recommencer.",
                    showTime: 5000
                })
                idInputpseudo.val("")
                break
            case technicalMessages.fromServer.errors.incorrectPseudo:
                putErrorUnderTextInput(idInputpseudo, {
                    txt: "Ce pseudo est incorrect. Merci de recommencer.",
                    showTime: 5000
                })
                console.log("%cCe pseudo est incorrect. Merci de recommencer.", "color: red; font-weight: bold; font-size: large")
                idInputpseudo.val("")
                break
        }
    }
    else if (valueObject.type === "technicalMsg") {
        switch (valueObject.value) {
            case technicalMessages.fromServer.messages.userNotAlreadyFound:

                console.log("Le pseudo de l'utilisateur est : "+pseudo)

                // New page AJAX call, for keep the same JavaScript (and the same variables)
                let xhr = new XMLHttpRequest()                          // Create an 'XMLHttpRequest' instance
                xhr.open("GET", "loggedInPage-onlyIdContent.html")      // Request the HTML file named 'loggedInPage-onlyIdContent.html' with a GET protocol
                xhr.responseType = "text"                               // The response format must be a text file (HTML is text)
                xhr.send()                                              // Send the request
                xhr.onload = function(){                                // This code will be executed when the response is received
                    console.log(xhr.response)
                    console.log(xhr.response.length + " octets  téléchargés\n")
                    document.getElementById("content").innerHTML = xhr.response
                    document.getElementById("titlePseudo").innerHTML += pseudo
                    document.getElementById("okmessage").addEventListener("click", sendMessage)
                    page = 1
                }
                break
            
        }
    }
})

wst.addEventListener("close", async evt => {
    if (! dontSendUnconnectNotifs) {
        
        alert(`La connection est perdue.
La page se rechargera automatiquement 3 sec après que vous ayez cliqué OK.`)
            await pause(3000)
            location.reload()
    }
})