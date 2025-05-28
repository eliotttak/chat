let idOkpseudo = $("#okpseudo") // The 'Rejoindre le chat' (Join chat) button of the first page.
let idInputpseudo = $("#inputpseudo") // The text input of the first page, where the user enters his/her pseudo.
let pseudo // The user's pseudo
let page = 0 // The page number : 0 is the first page where the user must input his/her pseudo, and 1 is the messages page.
let dontSendUnconnectNotifs = false
let inputError
let debug = /debug=true/.test(location.search)

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

/**
 * @description Put a message under a text input (this is the main usage but it work with all elements)
 * @param {JQuery} input The jQuery object of the element below which the message will be displayed
 * @param {Object} [settings] The others options
 * @param {string} [settings.txt="Veuillez respecter le format"] The message content 
 * @param {string} [settings.color="#FF0000"] The message color
 * @param {number} [settings.showTime=Infinity] Duration of message appearance. If equal to Infinity, the message will never disappear.
 * @returns {JQuery} The jQuery object of the new message's span
 */
function putErrorUnderTextInput(input, settings = {}) {
    if (debug == true) {
        debugger
    }

    const txt = settings.txt || "Veuillez respecter le format"
    const color = settings.color || "#FF0000"
    const showTime = settings.showTime || Infinity

    const width = input.width()
    const top = input.offset().top
    const height = input.height()
    const left = input.offset().left

    
    input.parent().append(`<span id="error-under-input-${input.attr("id")}"></span>`)
    let newSpan = $(`#error-under-input-${input.attr("id")}`)
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
    
    return newSpan
}   

setTimeout(async () => {
    await Notification.requestPermission()
    const myNotif = new Notification("Notif test", {
        body: "Hello",
        icon: "/favicon.ico"
    })
}, 10000)