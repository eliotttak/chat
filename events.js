window.addEventListener("beforeunload", function (event) {
    disconnect(wst)
});


okpseudo.addEventListener("click", () => {
    pseudo = document.getElementById("inputpseudo").value
    if (/^\s*$/.test(pseudo)) {
        alert("Votre pseudo est vide ou ne contient que des espaces. Merci de recommencer.")
        return
    }
    if (pseudo == "server") {
        alert("Désolé, ce pseudo est indisponible.")
        return
    }
    sendPseudo(pseudo)
    console.log("Le pseudo de l'utilisateur est : "+pseudo)

    // Appel AJAX de la nouvelle page, afin de garder le même JavaScript (et les mêmes variables)
    let xhr = new XMLHttpRequest()                          // Créer une instance de 'XMLHttpRequest'
    xhr.open("GET", "loggedInPage-onlyIdContent.html")      // On demande la page 'loggedInPage-onlyIdContent.html' en GET
    xhr.responseType = "text"                               // Le format de la réponse doit être un fichier texte
    xhr.send()                                              // Envoyer la réponse
    xhr.onload = function(){                                // Executé quand on reçoit la réponse
        console.log(xhr.response)
        console.log(xhr.response.length + " octets  téléchargés\n")
        document.getElementById("content").innerHTML = xhr.response
        document.getElementById("titlePseudo").innerHTML += pseudo
        document.getElementById("okmessage").addEventListener("click", sendMessage)
        page = 1
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
        if (valueObject.sender == "server"){
            document.getElementById("messages").innerHTML = `<span class="fromServer">${valueObject.value}</span><br/>` + document.getElementById("messages").innerHTML
        }
        else{
            document.getElementById("messages").innerHTML = `<span class="pseudoLabel">&nbsp;${valueObject.sender} </span>&nbsp${valueObject.value}<br/>` + document.getElementById("messages").innerHTML
        }
    }
    else if (valueObject.type === "technicalError") {
        switch (valueObject.value) {
            case technicalErrors.userAlreadyFound:
                alert ("Pseudo déjà utilisé. Rechargement de la page.")
                location.reload()
        }
    }
})

wst.addEventListener("close", async evt =>{
    alert(`La connection est perdue.
La page se rechargera automatiquement 3 sec après que vous ayez cliqué OK.`)
        await pause(3000)
        location.reload()
})