'use strict'

import AbstractView from "./AbstractView.js";

export default class GameLobbyView extends AbstractView {
    constructor(model) {
        super("div_gamelobbyview");
        this.model = model;

        this.readyHandler = () => {};

        // model.registerUserListListener(() => {
        //     this.render();
        // });

        this.button_ready = document.getElementById("button_ready");
        this.span_lobby_code = document.getElementById("lobby_code");
        this.userlist_lobby = document.getElementById("userlist_lobby");


        this.button_ready.onclick = () => {
            this.readyHandler();
        };

        this.model.onUserlistChangedListeners.push(() => {
            let html = "<ul>";

            for (const user of this.model.userlist) {
                html += `<li>${user.userName} `;
                html += user.ready ? "(ready)" : "(not ready)"
                html += "</li>"
            }

            html += "</ul>";

            this.userlist_lobby.innerHTML = html;
        });

    }

    set lobbyCode(code) {
        this.span_lobby_code.innerHTML = code;
    }
}