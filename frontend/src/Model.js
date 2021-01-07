import {createGame, getGame, getWordlists, joinGame, ServerAPISocket} from "./ServerAPI.js"


export default class Model {

    constructor() {
        this.onUserlistChangedListeners = [];
        this.onUserlistChanged = () => {
            for (const listener of this.onUserlistChangedListeners) {
                listener();
            }
        };

        this.onCanvasChanged = () => {};
        
        this.onChatUpdate = () => {};
        this.onRoundUpdate = () => {};
        this.onGameUpdate = () => {};

        this.onGameCreated = () => {};
        this.onGameJoined = () => {};
        this.onGameStarted = () => {};
        this.onGameFinished = () => {};

        this.userlist = [];
        this.chatMessages = [];
        this._canvasImage = "";

        this.gameStarted = false;
        this.gameFinished = false;
        this.currentRound = -1;
        this.numberOfRounds = -1;

        this.currentWord = "";
        this.currentWordHint = "";
        this.timeLeft = 0;

        this.userId = ""
        this.gameId = ""
        this._ready = false;

        this.socket = null;
        // fun();

        getWordlists().then(result => {
            for(let i = 0; i < result.length; i++) {
                let wordlist = result[i];
                window.sessionStorage.setItem(wordlist.title, JSON.stringify(wordlist));
            }
        }); /*.then(() => {
            loadSessionStorageWordlists();
        });*/

        // joinGame("game", "lukas").then(result => {
        //     console.log(result);
        // });

 
        // this.socket.sendReadyState(true)


    }

    connectSocket() {
        this.socket = new ServerAPISocket(this.userId);

        this.socket.onUserlistUpdate = users => {
            this.userlist = users;
            this.onUserlistChanged();
        };

        this.socket.onRoundUpdate = (started, finished, currentRound, numberOfRounds) => {
            let oldStarted = this.gameStarted;
            let oldFinished = this.gameFinished;
            this.gameStarted = started;
            this.gameFinished = finished;
            this.currentRound = currentRound;
            this.numberOfRounds = numberOfRounds;

            if (!oldStarted && this.gameStarted) {
                this.onGameStarted();
            }

            if (!oldFinished && this.gameFinished) {
                this.onGameFinished();
            }

            this.onRoundUpdate();
        };

        this.socket.onGameUpdate = (currentWord, wordHintIndices, timeLeft) => {
            this.currentWord = currentWord;
            this.currentWordHint = "";

            for (var i = 0; i < currentWord.length; i++) {
                if (wordHintIndices.includes(i)) {
                    this.currentWordHint += currentWord[i];
                }
                else {
                    this.currentWordHint += "_";
                }
            }
            
            this.timeLeft = timeLeft;

            this.onGameUpdate();
        };

        this.socket.onCanvasContent = (image) => {
            this._canvasImage = image;
            this.onCanvasChanged();
        };

        this.socket.onChatMessage = (userId, message) => {
            for (const user of this.userlist) {
                if (userId === user.userId) {
                    this.chatMessages.push({
                        userName: user.userName,
                        message: message
                    });
                }
            }

            this.onChatUpdate();
        }

        this.socket.sendHello();
    }

    createGame(userName, numberOfPlayers, numberOfRounds, wordlist) {
        createGame(numberOfPlayers, numberOfRounds, wordlist)
        .then(result => {
            this.gameId = result.gameId;
            this.onGameCreated();
            return joinGame(result.gameId, userName)

        })
        .then(result => {
            this.userId = result.userId;
            this.connectSocket();
            this.onGameJoined();
        })
        .catch(error => {
            console.log(error);
        });
    }

    joinGame(userName, gameId) {
        joinGame(gameId, userName)
        .then(result => {
            this.userId = result.userId;
            this.connectSocket();
            this.onGameJoined();
        })
        .catch(error => {
            console.log(error);
        })
    }

    guessWord(guess) {
        this.socket.sendChatMessage(guess);
    }

    set ready(ready) {
        this.socket.sendReadyState(ready);
        this._ready = ready;
    }

    get ready() {
        return this._ready;
    }

    get canvasImage() {
        return this._canvasImage;
    }

    set canvasImage(image) {
        this.socket.sendCanvasContent(image);
    }

    get drawing() {
        const me = this.userlist.find(user => user.userId === this.userId);
        return me.drawing;
    }
}

/*
function loadSessionStorageWordlists() {
    const storage = window.sessionStorage;

    if (storage.length) {
        for (let i = 0; i < storage.length; i++) {
            
            let wordlist_name = storage.key(i);
            addWordlist(wordlist_name);
            addWordlistSelection(wordlist_name);
        }
    }
}

function addWordlist(wordlist_name) {
    let wordlistsElement = document.getElementById("wordlists_currently");
    wordlistsElement.innerHTML += ('<li>' + wordlist_name + '<\li>');
}

function addWordlistSelection(wordlist_name) {
    let selectionElement = document.getElementById("input_wordlist");
    selectionElement.innerHTML += ('<option value="' + wordlist_name + '">' + wordlist_name + '</option>');
}
*/