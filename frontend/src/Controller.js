

export default class Controller {
    constructor(model, titleScreenView, manageWordlistsView, createGameView, gameLobbyView, gameView) {
        this.model = model;
        this.manageWordlistsView = manageWordlistsView;
        this.createGameView = createGameView;
        this.titleScreenView = titleScreenView;
        this.gameLobbyView = gameLobbyView;
        this.gameView = gameView;


        this.gameView.visible = false;
        this.gameLobbyView.visible = false;
        this.titleScreenView.visible = true;
        this.manageWordlistsView.visible = false;
        this.createGameView.visible = false;

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
            // TODO Input validation
            console.log(this.titleScreenView.userName);
            console.log(this.titleScreenView.lobbyCode);
            this.model.joinGame(this.titleScreenView.userName, this.titleScreenView.lobbyCode);
        };

        this.titleScreenView.switchToCreateGameViewHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = true;
        };

        this.titleScreenView.manageWordlistsHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = true;
            this.createGameView.visible = false;
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
        }

        this.model.onGameStarted = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = true;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
        }

        this.model.onGameFinished = () => {
            // TODO
        }

        this.model.onGameCreated = () => {
            const id = this.model.gameId;
            this.gameLobbyView.lobbyCode = id;
        }
    }


}