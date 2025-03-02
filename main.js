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

function putErrorUnderTextInput(input, txt = "Veuillez respecter le format", color = "#FF0000") {
    const width = input.clientWidth
    const top = input.offsetTop
    const height = input.clientHeight
    const left = input.offsetLeft

    let newSpan = document.createElement("span")
    newSpan.style.position = "absolute"
    newSpan.style.top = (top + height + 5) + "px"
    newSpan.style.left = left + "px"
    newSpan.style.width = width + "px"
    newSpan.style.backgroundColor = color
    newSpan.innerHTML = txt
    input.parentNode.appendChild(newSpan)

    console.log(width, height, top, left)
}