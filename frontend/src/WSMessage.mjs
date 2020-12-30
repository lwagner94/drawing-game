

export const WSMessageType = {
    "CANVAS_CONTENT" : 1,
    "CHAT_MESSAGE": 2
}

Object.freeze(WSMessageType);

export class WSMessage {
    constructor(type, payload) {
        this.type = type
        this.payload = payload
    }

    static fromJSONString(json) {
        return Object.assign(new WSMessage(), JSON.parse(json))
    }
}

