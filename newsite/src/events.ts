import * as main from "./main";
import * as websocket from "./websocket";

window.addEventListener("beforeunload", () => {
  main.dontSendUnconnectNotifs(true);
  websocket.wst.close();
});

main.$okPseudoBtn.on("click", () => {
  let username := main.$usernameInput.val();
  main.username();
});
