let idOkpseudo = $("#okpseudo") // The 'Rejoindre le chat' (Join chat) button of the first page.
let idInputpseudo = $("#inputpseudo") // The text input of the first page, where the user enters his/her pseudo.
let pseudo // The user's pseudo
let page = 0 // The page number : 0 is the first page where the user must input his/her pseudo, and 1 is the messages page.

async function pause(time) {
    return new Promise(resolve => setTimeout(resolve, time))
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
background-color: ${options.bckgc || "#333333"}
border-radius: ${options.bordrad || "5px"}   
`)
    divNotif.appendChild(spanContent)
    document.body.appendChild(divNotif)

}

function putErrorUnderTextInput(input, txt = "Veuillez respecter le format", color = "#FF0000") {
    const width = input.width()
    const top = input.offset().top
    const height = input.height()
    const left = input.offset().left

    let newSpan = document.createElement("span")
    newSpan.style.position = "absolute"
    newSpan.style.top = (top + height + 5) + "px"
    newSpan.style.left = (left + 5) + "px"
    newSpan.style.width = width + "px"
    newSpan.style.color = color
    newSpan.style.fontSize = "10px"
    newSpan.innerHTML = txt
    input.parent().append(newSpan)

    console.log(width, height, top, left)
}   