'use strict'

import AbstractView from "./AbstractView.js";

export default class GameView extends AbstractView {
    constructor(model) {
        super("div_gameview");
        this.model = model;
        
        this.canvasDrawing = null;

        this.currentX = 0;
        this.currentY = 0;
        this.ctx = null;
        this.onCanvasChanged = (content) => {};
        this.onWordGuessed = (guess) => {};

        this.userlist_game = document.getElementById("userlist_game");
        this.wordHintSpan = document.getElementById("span_word_hint");
        this.timeLeftSpan = document.getElementById("span_time_left");
        this.roundSpan = document.getElementById("span_round");
        this.guessInput = document.getElementById("input_guess");
        this.guessButton = document.getElementById("button_guess");
        this.chatDiv = document.getElementById("div_chat");
        this.drawingEnabled = false;

        this.setupHandlers();
    }

    setupHandlers() {
        this.guessButton.onclick = () => {
            this.onWordGuessed(this.guessInput.value);
            this.guessInput.value = "";
        }

        this.model.onUserlistChangedListeners.push(() => {
            let html = "<ul>";

            for (const user of this.model.userlist) {
                html += `<li>${user.userName} (${user.score})`;
                if (user.drawing) {
                    html += " (drawing)";
                }
                html += "</li>";
            }

            html += "</ul>";

            this.userlist_game.innerHTML = html;
            this.drawingEnabled = this.model.drawing;
        });

        this.model.onRoundUpdate = () => {
            console.log("Round update");
            this.ctx.fillStyle = "#FFF";
            this.ctx.fillRect(0, 0, this.canvasDrawing.width, this.canvasDrawing.height);

            this.roundSpan.innerHTML = `${this.model.currentRound}/${this.model.numberOfRounds}`
        };

        this.model.onGameUpdate = () => {
            if (this.model.drawing) {
                this.wordHintSpan.innerHTML = this.model.currentWord;
            }
            else {
                this.wordHintSpan.innerHTML = this.model.currentWordHint;
            }

            this.timeLeftSpan.innerHTML = this.model.timeLeft;
            
        };

        this.model.onChatUpdate = () => {
            let html = "<ul>";

            for (const message of this.model.chatMessages) {
                html += `<li>${message.userName}: ${message.message} </li>`;
            }

            html += "</ul>";

            this.chatDiv.innerHTML = html;
        };

        this.model.onCanvasChanged = content => {
            if (this.canvasDrawing !== null) {
                var img = new Image();
                img.onload = () => {
                    // canvas.width = img.width;
                    // canvas.height = img.height;
                    this.canvasDrawing.getContext("2d").drawImage(img, 0, 0);
                };
            
                img.src = this.model.canvasImage;
            }

        };

        this.canvasDrawing = document.getElementById("canvas_drawing");
        this.ctx = this.canvasDrawing.getContext("2d");
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillRect(0, 0, this.canvasDrawing.width, this.canvasDrawing.height);
        this.canvasDrawing.oncontextmenu = (event) => {return false};

        this.canvasDrawing.addEventListener('mousemove', (event) => {
            if (!this.drawingEnabled) {
                return;
            }
            var rect = this.canvasDrawing.getBoundingClientRect();
            if (event.buttons !== 1 && event.buttons !== 2) {
                return;
            }
    
            this.ctx.beginPath();
            this.ctx.lineWidth = 5;
            this.ctx.lineCap = "round";
            if (event.buttons === 1) {
                this.ctx.strokeStyle = "#c0392b";
            }
            else if (event.buttons === 2) {
                this.ctx.strokeStyle = "white"
            }

            
    
            this.ctx.moveTo(this.currentX, this.currentY);

            this.currentX = event.clientX - rect.left;
            this.currentY = event.clientY - rect.top;

            this.ctx.lineTo(this.currentX, this.currentY);
            this.ctx.stroke();


            // TODO: Rate limiting??
            this.onCanvasChanged(this.canvasDrawing.toDataURL("image/jpeg", 0.5));
        });
        this.canvasDrawing.addEventListener('mousedown', (event) => {
            if (!this.drawingEnabled) {
                return;
            }
            var rect = this.canvasDrawing.getBoundingClientRect();
            this.currentX = event.clientX - rect.left;
            this.currentY = event.clientY - rect.top;

        });
        this.canvasDrawing.addEventListener('mouseup', (event) => {

        });
        this.canvasDrawing.addEventListener('mouseout', (event) => {
        });

        this.canvasDrawing.addEventListener('mouseenter', (event) => {
            if (!this.drawingEnabled) {
                return;
            }

            var rect = this.canvasDrawing.getBoundingClientRect();
            this.currentX = event.clientX - rect.left;
            this.currentY = event.clientY - rect.top;

        });
    }

}