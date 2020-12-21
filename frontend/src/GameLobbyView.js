'use strict'

import AbstractView from "./AbstractView";

export default class GameLobbyView extends AbstractView {
    constructor(model) {
        super("div_gamelobbyview");
        this.model = model;
        this.input_number_of_players = null;
        this.input_rounds = null;
        this.input_wordlist = null;
        this.input_lobby_code = null;
        this.button_start_game = null;

        model.registerUserListListener(() => {
            this.render();
        });
    }

    get html() {
        var content = `
        
        Number of Players <input id=input_number_of_players></input>
        Rounds <input id=input_rounds></input>
        Word list <input id=input_wordlist></input>
        Lobby code<input type="text" id=input_lobby_code></input>
        <button id=button_start_game>Start game</button>
        Players: 
        `
        for (const player of this.model.getUserList()) {
            content += player + ", "
        }

        return content;

    }

    afterRender() {
        this.input_number_of_players = document.getElementById("input_number_of_players");
        this.input_rounds = document.getElementById("input_rounds");;
        this.input_wordlist = document.getElementById("input_wordlist");;
        this.input_lobby_code = document.getElementById("input_lobby_code");;
        this.button_start_game = document.getElementById("button_start_game");;
        

        // this.button_join_game.onclick = function() {
        //     console.log("Join Game");
        // }

        // this.button_create_game.onclick = function() {
        //     console.log("Create Game");
        // }
    }


}