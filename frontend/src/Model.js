
import {WSMessage, WSMessageType} from "./WSMessage.mjs"

export default class Model {

    constructor() {
        this.userListListeners = [];
        this.userList = ["Hans", "Fritz"];

        this.canvasListener = (content) => {};

        // var fun = () => {
        //     console.log("Timeout");
        //     this.userList.push("Lukas");
        //     this.notifyUserListListeners();
        //     setTimeout(fun, 3000);
        // }


        // fun();

        this.websocket = new WebSocket("ws://" + window.location.host + "/api/socket");

        this.websocket.onopen = () => {
            console.log("Open");
        }

        this.websocket.onerror = (error) => {
            console.log("error: " + JSON.stringify(error));
        }

        this.websocket.onmessage = (event) => {
            const message = WSMessage.fromJSONString(event.data);
            // console.log(message);

            if (message.type === WSMessageType.CANVAS_CONTENT) {
                this.notifyCanvasListener(message.payload);
            }
        }

    }

    registerUserListListener(listener) {
        this.userListListeners.push(listener);
    }

    notifyUserListListeners() {
        for (const handler of this.userListListeners) {
            handler();
        }
    }

    registerCanvasListener(listener) {
        this.canvasListener = listener;
    }

    notifyCanvasListener(content) {
        this.canvasListener(content);
    }

    getUserList() {
        return this.userList;
    }

    setCanvasContent(content) {
        const message = new WSMessage(WSMessageType.CANVAS_CONTENT, content)

        this.websocket.send(JSON.stringify(message));
    }






}