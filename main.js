let okpseudo = document.getElementById("okpseudo")
let pseudo
let page = 0  

async function pause(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function sendInPageNotification(options) {
    let divNotif = document.createElement("div")
    let spanContent = document.createElement("span")
    spanContent.innerHTML = options.content
    if (options.icon != undefined) {
        let imgIcon = document.createElement("img")
        imgIcon.setAttribute("src", options.icon)
        imgIcon.setAttribute("height", options.iconHeight || "45px")
        divNotif.appendChild(imgIcon)
    }
    divNotif.setAttribute("style", `
background-color: ${options.bckgc || "#333333"};
border-radius: ${options.bordrad || "5px"}   
`)
    divNotif.appendChild(spanContent)
    document.body.appendChild(divNotif)

}

