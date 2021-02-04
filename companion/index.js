import * as messaging from "messaging";

messaging.peerSocket.addEventListener("message", (evt) => {
  console.log(JSON.stringify(evt.data));
});