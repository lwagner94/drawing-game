
export default class Controller {
    constructor(model, titleScreenView, manageWordlistsView, createGameView, gameLobbyView, gameView, gameFinishedView) {
        this.model = model;
        this.manageWordlistsView = manageWordlistsView;
        this.createGameView = createGameView;
        this.titleScreenView = titleScreenView;
        this.gameLobbyView = gameLobbyView;
        this.gameView = gameView;
        this.gameFinishedView = gameFinishedView;


        this.gameView.visible = false;
        this.gameLobbyView.visible = false;
        this.titleScreenView.visible = true;
        this.manageWordlistsView.visible = false;
        this.createGameView.visible = false;
        this.gameFinishedView.visible = false;

        this.registerHandlers();

        // this.titleScreenView.visible = true;
        
    }

    registerHandlers() {

        this.gameView.onCanvasChanged = (content) => {
            this.model.canvasImage = content;
        };

        this.gameView.onWordGuessed = (guess) => {
            this.model.guessWord(guess);
        }

        this.titleScreenView.joinGameHandler = () => {
            if(this.titleScreenView.input_name.value == "") {
                alert("You did not enter a nickname, please provide one.");
                return;
            }
            else {
                if (this.titleScreenView.lobbyCode == "") {
                    alert("You did not enter a lobby code, please provide one.");
                    return;
                }
                else {
                    this.model.joinGame(this.titleScreenView.userName, this.titleScreenView.lobbyCode);
                }
            }
        };

        this.titleScreenView.switchToCreateGameViewHandler = () => {
            if(this.titleScreenView.input_name.value == "") {
                alert("You did not enter a nickname, please provide one.");
                return;
            }
            else {
                this.titleScreenView.visible = false;
                this.gameLobbyView.visible = false;
                this.gameView.visible = false;
                this.manageWordlistsView.visible = false;
                this.createGameView.visible = true;
                this.gameFinishedView.visible = false;
            }
        };

        this.titleScreenView.manageWordlistsHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = true;
            this.createGameView.visible = false;
            this.gameFinishedView.visible = false;
        }

        this.gameLobbyView.readyHandler = () => {
            this.model.ready = !this.model.ready;
        }

        this.createGameView.createGameHandler = () => {
            // TODO Validation
            const players = parseInt(this.createGameView.numberOfPlayers);
            const rounds = parseInt(this.createGameView.numberOfRounds);
            const wordlist_key = this.createGameView.selectedWordlist;
            const wordlist = this.model.loadWordlist(wordlist_key);

            this.model.createGame(this.titleScreenView.userName, 
                players, rounds, wordlist);
        }

        this.model.onGameJoined = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = true;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
            this.gameFinishedView.visible = false;
        }

        this.model.onGameStarted = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = true;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
            this.gameFinishedView.visible = false;
        }

        this.model.onGameFinished = () => {
            this.model.updateGameFinished();

            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
            this.gameFinishedView.visible = true;

            this.model.reset();
        }

        this.model.onGameCreated = () => {
            const id = this.model.gameId;
            this.gameLobbyView.lobbyCode = id;
        }

        this.manageWordlistsView.uploadWordlists = (files)  => {
            this.model.uploadWordlists(files);
        }
    
        this.manageWordlistsView.returnHomescreen = () => {
            this.titleScreenView.visible = true;
            this.gameLobbyView.visible = false;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
            this.gameFinishedView.visible = false;
        }

        this.gameFinishedView.returnHomescreen = this.manageWordlistsView.returnHomescreen;
    }
}