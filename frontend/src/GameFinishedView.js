'use strict'

import AbstractView from "./AbstractView.js";

export default class GameFinishedView extends AbstractView {
    constructor(model) {
        super("div_gamefinishedview");
        this.model = model;

        this.homeButton = document.getElementById("button_return_homescreen_finished");
        this.gameWinnerText = document.getElementById("winner_text");
        this.userlistFinished = document.getElementById("userlist_finished");

        this.winningAudio = document.getElementById("winning_audio");

        this.returnHomescreen = () => {};
        this.setupHandlers();

    }
    
    setupHandlers() {
        this.homeButton.onclick = () => {
            this.returnHomescreen();
        }

        this.model.updateGameFinished = () => {
            let userlist = this.model.userlist;
            userlist.sort((a, b) => {
                return b.score - a.score;
            });

            this.winningAudio.play();

            this.gameWinnerText.innerText = `The winner is ${userlist[0].userName}!`;

            let html = "<ol type=\"1\">";

            for (const user of this.model.userlist) {
                html += `<li>${user.userName} (${user.score})</li>`
            }

            html += "</ol>";

            this.userlistFinished.innerHTML = html; 
        }
    }
}