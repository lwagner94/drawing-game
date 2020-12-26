

export default class Controller {
    constructor(model, mainView, titleScreenView, gameLobbyView, gameView) {
        this.model = model;
        this.mainView = mainView;
        this.titleScreenView = titleScreenView;
        this.gameLobbyView = gameLobbyView;
        this.gameView = gameView;

        this.registerHandlers();

        // this.titleScreenView.visible = true;
        
    }

    registerHandlers() {
    
        this.mainView.handler = () => {
            console.log("Click");
            // this.titleScreenView.visible = !this.titleScreenView.visible;
            this.gameView.visible = true;
        }

        this.gameView.canvasChangedHandler = (content) => {
            this.model.setCanvasContent(content);
        };

        // this.titleScreenView.joinGameHandler = () => {
        //     this.titleScreenView.visible = false;
        //     this.gameLobbyView.visible = true;

        // };

        // this.titleScreenView.createGameHandler = () => {
        //     this.titleScreenView.visible = false;
        //     this.gameLobbyView.visible = true;
        // };

        // this.gameLobbyView.startGameHandler = () => {
        //     this.titleScreenView.visible = false;
        //     this.gameLobbyView.visible = false;
        //     this.gameView.visible = true;
        // }
    }


}