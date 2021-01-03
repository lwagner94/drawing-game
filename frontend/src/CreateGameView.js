'use strict'

import AbstractView from "./AbstractView.js";

export default class CreateGameView extends AbstractView {
    constructor(model) {
        super("div_creategameview");
        this.model = model;
        this.input_number_of_players = null;
        this.input_rounds = null;
        this.input_wordlist = null;
        this.button_create_game = null;

        this.createGameHandler = () => {};

        this.input_number_of_players = document.getElementById("input_number_of_players");
        this.input_rounds = document.getElementById("input_rounds");
        this.input_wordlist = document.getElementById("input_wordlist");
        this.input_lobby_code = document.getElementById("input_lobby_code");
        this.button_create_game = document.getElementById("button_create_game");


        this.button_create_game.onclick = () => {
            this.createGameHandler();
        };
    }
}