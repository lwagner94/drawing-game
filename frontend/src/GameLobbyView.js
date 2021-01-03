'use strict'

import AbstractView from "./AbstractView.js";

export default class GameLobbyView extends AbstractView {
    constructor(model) {
        super("div_gamelobbyview");
        this.model = model;
        this.input_number_of_players = null;
        this.input_rounds = null;
        this.input_wordlist = null;
        this.input_lobby_code = null;
        this.button_ready = null;

        this.readyHandler = () => {};

        // model.registerUserListListener(() => {
        //     this.render();
        // });

        this.input_number_of_players = document.getElementById("input_number_of_players");
        this.input_rounds = document.getElementById("input_rounds");
        this.input_wordlist = document.getElementById("input_wordlist");
        this.input_lobby_code = document.getElementById("input_lobby_code");
        this.button_ready = document.getElementById("button_ready");


        this.button_ready.onclick = () => {
            this.readyHandler();
        };
    }
}