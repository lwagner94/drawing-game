

export default class Controller {
    constructor(model, mainView, titleScreenView, gameLobbyView) {
        this.model = model;
        this.mainView = mainView;
        this.titleScreenView = titleScreenView;
        this.gameLobbyView = gameLobbyView;

        this.registerHandlers();
    }

    registerHandlers() {
    
        this.mainView.handler = () => {
            console.log("Click");
            this.titleScreenView.visible = !this.titleScreenView.visible;
        }

        this.titleScreenView.joinGameHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = true;

        };

        this.titleScreenView.createGameHandler = () => {
            this.titleScreenView.visible = false;
            this.gameLobbyView.visible = true;
        };
    }


}