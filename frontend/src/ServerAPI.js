
// TODO: Error handling?

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function getWordlists() {
    return fetch("/api/wordlists")
    .then(handleErrors)
    .then(result => result.json())
}

export function createGame(numberOfPlayers, numberOfRounds, wordlist) {
    return fetch("/api/game", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rounds: numberOfRounds, 
            numberOfPlayers: numberOfPlayers,
            wordlist: wordlist
        })
    })
    .then(handleErrors)
    .then(result => result.json());
}

export function getGame(gameId) {
    return fetch(`/api/game/${gameId}`)
    .then(handleErrors)
    .then(result => result.json())
}

export function joinGame(gameId, userName) {
    return fetch(`/api/game/${gameId}/join`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: userName,
        })
    })
    .then(handleErrors)
    .then(result => result.json());
}

export class ServerAPISocket {
    constructor(userId) {
        this.socket = new WebSocket("ws://" + window.location.host + "/api/socket");
        this.connected = false;
        this.queue = [];
        this.userId = userId;

        this.onCanvasContent = (image) => {};
        this.onChatMessage = (userId, message) => {};
        this.onUserlistUpdate = (users) => {};
        this.onRoundUpdate = (started, finished, currentRound, numberOfRounds) => {};
        this.onGameUpdate = (currentWord, wordHintIndices, timeLeft) => {};


        this.socket.onopen = () => {
            console.log("Socket connected!");
            this.connected = true;

            for (const object of this.queue) {
                this.sendObject(object);
            }

            this.queue = [];
        };

        this.socket.onerror = (error) => {
            console.log("Socket Error: " + JSON.stringify(error));
            this.connected = false;
        };

        this.socket.onmessage = (message) => {
            this.handleMessage(JSON.parse(message.data));
        };
    }

    handleMessage(message) {
        const p = message.payload;
        if (message.type === "CANVAS_CONTENT") {
            this.onCanvasContent(p.image);
        }
        else if (message.type === "CHAT_MESSAGE") {
            this.onChatMessage(p.userId, p.message);
        }
        else if (message.type === "USERLIST_UPDATE") {
            this.onUserlistUpdate(p);
        }
        else if (message.type === "ROUND_UPDATE") {
            this.onRoundUpdate(p.started, p.finished, p.currentRound, p.numberOfRounds);
        }
        else if (message.type === "GAME_UPDATE") {
            this.onGameUpdate(p.currentWord, p.wordHintIndices, p.timeLeft);
        }
    }

    sendObject(object) {
        if (!this.connected) {
            this.queue.push(object);
            return;
        }

        this.socket.send(JSON.stringify(object));
    }

    sendHello(userId) {
        let o = {
            "type": "HELLO",
            "payload": {
                "userId": this.userId
            }
        };
        this.sendObject(o);
    }

    sendCanvasContent(image) {
        let o = {
            "type": "CANVAS_CONTENT",
            "payload": {
                "userId": this.userId,
                "image": image
            }
        };
        this.sendObject(o);
    }

    sendChatMessage(message) {
        let o = {
            "type": "CHAT_MESSAGE",
            "payload": {
                "userId": this.userId,
                "message": message
            }
        };
        this.sendObject(o);
    }

    sendReadyState(readyState) {
        let o = {
            "type": "READY_STATE",
            "payload": {
                "userId": this.userId,
                "ready": readyState
            }
        };
        this.sendObject(o);
    }

    close() {
        if (this.connected) {
            this.socket.close()
        }
    }
}