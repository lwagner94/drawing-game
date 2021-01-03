

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

        this.gameView.canvasChangedHandler = (content) => {
            this.model.setCanvasContent(content);
        };

        this.titleScreenView.joinGameHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = true;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
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
            // TODO

            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = true;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
        }

        this.createGameView.createGameHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = true;
            this.gameView.visible = false;
            this.manageWordlistsView.visible = false;
            this.createGameView.visible = false;
        }
    }


}