

export default class Controller {
    constructor(model, titleScreenView, gameLobbyView, gameView) {
        this.model = model;
        this.titleScreenView = titleScreenView;
        this.gameLobbyView = gameLobbyView;
        this.gameView = gameView;


        this.gameView.visible = false;
        this.gameLobbyView.visible = false;
        this.titleScreenView.visible = true;

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
        };

        this.titleScreenView.createGameHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = true;
            this.gameView.visible = false;
        };

        this.gameLobbyView.startGameHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = false;
            this.gameView.visible = true;
        }
    }


}