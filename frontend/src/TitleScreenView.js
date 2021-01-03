'use strict'

import AbstractView from "./AbstractView.js";

export default class TitleScreenView extends AbstractView {
    constructor(model) {
        super("div_titlescreenview");
        this.model = model;
        
        this.joinGameHandler = () => {};
        this.switchToCreateGameViewHandler = () => {};
        this.manageWordlistsHandler = () => {};

        this.button_join_game = document.getElementById("button_join_game");
        this.button_switch_to_create_game_view = document.getElementById("button_switch_to_create_game_view");
        this.input_lobby_code = document.getElementById("input_lobby_code");
        this.input_name = document.getElementById("input_name");
        this.button_manage_wordlists = document.getElementById("button_manage_wordlists");

        this.button_join_game.onclick = () => {
            this.joinGameHandler();
        };
        this.button_switch_to_create_game_view.onclick = () => {
            this.switchToCreateGameViewHandler();
        };

        this.button_manage_wordlists.onclick = () => {
            this.manageWordlistsHandler();
        }
    }
}