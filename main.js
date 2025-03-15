let idOkpseudo = $("#okpseudo") // The 'Rejoindre le chat' (Join chat) button of the first page.
let idInputpseudo = $("#inputpseudo") // The text input of the first page, where the user enters his/her pseudo.
let pseudo // The user's pseudo
let page = 0 // The page number : 0 is the first page where the user must input his/her pseudo, and 1 is the messages page.
let dontSendUnconnectNotifs = false
let inputError

console.log($)
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

function putErrorUnderTextInput(input, settings = {}) {
    debugger

    const txt = settings.txt || "Veuillez respecter le format"
    const color = settings.color || "#FF0000"
    const showTime = settings.showTime || Infinity

    const width = input.width()
    const top = input.offset().top
    const height = input.height()
    const left = input.offset().left
    const date = new Date().getTime()  // The actual time will be in the new span's ID

<<<<<<< HEAD
    
    input.parent().append(`<span id="error-under-input-${input.attr("id")}"></span>`)
    let newSpan = $(`#error-under-input-${input.attr("id")}`)
=======
    input.parent().append(`<span id="error-under-input-${date}"></span>`)
    let newSpan = $(`#error-under-input-${date}`)
>>>>>>> 8da80e4 (Améliorer la function putErrorUnderInput() et interdire les ' ' dans le nom du pseudo)
    //newSpan.attr("id", "")
    newSpan.css("position", "absolute")
    newSpan.css("top", (top + height + 5) + "px")
    newSpan.css("left", (left + 5) + "px")
    newSpan.css("width", width + "px")
    newSpan.css("color", color)
    newSpan.css("font-size", "15px")
    newSpan.html(txt)

    if (showTime !== Infinity) {
        setTimeout(() => {
            newSpan.remove()
        }, showTime)
    }
    
    return {newSpan, date}
}   