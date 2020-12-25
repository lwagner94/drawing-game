'use strict'

import AbstractView from "./AbstractView";

export default class TitleScreenView extends AbstractView {
    constructor(model) {
        super("div_titlescreenview");
        this.model = model;
        this.input_name = null;
        this.button_create_game = null;
        this.input_lobby_code = null;
        this.button_join_game = null;
        this.joinGameHandler = () => {};
        this.createGameHandler = () => {};

    }

    get html() {
        return `
        
        Name <input id=input_name></input>
        <button id=button_create_game>Create game </button>
        Lobby code<input type="text" id=input_lobby_code></input>
        <button id=button_join_game>Join game</button>
        `

    }

    afterRender() {
        if (!this.visible)
            return;

        this.button_join_game = document.getElementById("button_join_game");
        this.button_create_game = document.getElementById("button_create_game");
        this.input_lobby_code = document.getElementById("input_lobby_code");
        this.input_name = document.getElementById("input_name");

        this.button_join_game.onclick = this.joinGameHandler;
        this.button_create_game.onclick = this.createGameHandler;
    }


}