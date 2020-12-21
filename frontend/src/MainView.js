'use strict'

import AbstractView from "./AbstractView";
import GameLobbyView from "./GameLobbyView";
import TitleScreenView from "./TitleScreenView"

export default class MainView extends AbstractView {
    constructor(model, titleScreenView, gameLobbyView) {
        super("div_mainview")
        this.model = model;
        this.titlescreenview = titleScreenView;
        this.gamelobbyview = gameLobbyView;

        this.handler = () => {};
    }
    
    get html() {
        return `
        Hello <b>mooo</b>
        <button id=mybutton type="button">Click Me!</button> 
        ${this.titlescreenview.inject()}
        ${this.gamelobbyview.inject()}

        `
    }

    afterRender() {
        const button = document.getElementById("mybutton");
        button.onclick = this.handler;
    }
}