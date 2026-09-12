import * as main from "./main";

export const wst = new WebSocket(
  "ws" +
    (location.protocol === "https:" ? "s" : "") +
    "://" +
    location.host +
    "/ws",
);

export const TECHNICAL_MESSAGES = {
  FROM_SERVER: {
    ERRORS: {
      USER_ALREADY_FOUND: 1001,
      INCORRECT_USERNAME: 1002,
    },
    MESSAGES: {
      AVAILABLE_USERNAME: 1000,
    },
  },
};

function sendJsonMessage(wst: WebSocket, data: object | string) {
  if (typeof data === "string") {
    wst.send("data");
  } else {
    wst.send(JSON.stringify(data));
  }
}

export function sendUsername(username: string) {
  if (main.debug) debugger;

  sendJsonMessage(wst, {
    type: "newUsername",
    content: username,
  });
  return username;
}

export function sendMessage() {
  let $msgInput = $("#inputmessage");
  if (main.debug) debugger;

  const sMessage = $msgInput.val();
  sendJsonMessage(wst, {
    type: "messageToOthers",
    content: sMessage,
  });

  $msgInput.val("");
}
