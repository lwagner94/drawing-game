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
        this.color = "#000000";
        this.onCanvasChanged = (content) => {};
        this.onWordGuessed = (guess) => {};
        this.templatePencilChanged = (content) => {};
        

        this.userlist_game = document.getElementById("userlist_game");
        this.wordHintSpan = document.getElementById("span_word_hint");
        this.timeLeftSpan = document.getElementById("span_time_left");
        this.roundSpan = document.getElementById("span_round");
        this.guessInput = document.getElementById("input_guess");
        this.guessButton = document.getElementById("button_guess");
        this.chatDiv = document.getElementById("div_chat");

        this.yellowButton = document.getElementById("button_yellow");
        this.orangeButton = document.getElementById("button_orange");
        this.redButton = document.getElementById("button_red");
        this.magentaButton = document.getElementById("button_magenta");
        this.blueButton = document.getElementById("button_blue");
        this.turquoiseButton = document.getElementById("button_turquoise");
        this.greenButton = document.getElementById("button_green");
        this.darkgreenButton = document.getElementById("button_darkgreen");
        this.brownButton = document.getElementById("button_brown");
        this.blackButton = document.getElementById("button_black");

        this.pencilSlider = document.getElementById("pencilsize_slider");

        this.ereaserButton = document.getElementById("button_ereaser");
        this.clearButton = document.getElementById("button_clear");

        this.pencilSizeCanvas = document.getElementById("pencilsize");

        this.penctx = document.getElementById("pencilsize").getContext('2d');


        this.drawingEnabled = false;

        this.setupHandlers();
        this.templatePencilChanged();
    }

    setupHandlers() {
        this.yellowButton.onclick = () => {
            this.color = "#ffff00";
            this.templatePencilChanged();
        }

        this.orangeButton.onclick = () => {
            this.color = "#ff9900";
            this.templatePencilChanged();
        }

        this.redButton.onclick = () => {
            this.color = "#ff0000";
            this.templatePencilChanged();
        }

        this.magentaButton.onclick = () => {
            this.color = "#8b008b";
            this.templatePencilChanged();
        }

        this.blueButton.onclick = () => {
            this.color = "#0000ff";
            this.templatePencilChanged();
        }

        this.turquoiseButton.onclick = () => {
            this.color = "#00ffff";
            this.templatePencilChanged();
        }

        this.greenButton.onclick = () => {
            this.color = "#00C800";
            this.templatePencilChanged();
        }

        this.darkgreenButton.onclick = () => {
            this.color = "#007015";
            this.templatePencilChanged();
        }

        this.brownButton.onclick = () => {
            this.color = "#6b3a0c";
            this.templatePencilChanged();
        }

        this.blackButton.onclick = () => {
            this.color = "#000000";
            this.templatePencilChanged();
        }

        this.clearButton.onclick = () => {
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillRect(0, 0, this.canvasDrawing.width, this.canvasDrawing.height);
        }

        this.ereaserButton.onclick = () => {
            this.color = "#ffffff";
            this.templatePencilChanged();
        }

        this.templatePencilChanged = () => {
            this.penctx.fillStyle = "#FFFFFF";
            this.penctx.fillRect(0, 0, this.pencilSizeCanvas.width, this.pencilSizeCanvas.height);

            this.penctx.beginPath();
            this.penctx.arc(this.pencilSizeCanvas.height/2, this.pencilSizeCanvas.width/2, (this.pencilSlider.value/2)+1, 0, 2 * Math.PI, false);
            this.penctx.fillStyle = "#000000";
            this.penctx.fill();

            this.penctx.beginPath();
            this.penctx.arc(this.pencilSizeCanvas.height/2, this.pencilSizeCanvas.width/2, this.pencilSlider.value/2, 0, 2 * Math.PI, false);
            this.penctx.fillStyle = this.color;
            this.penctx.fill();
        };

        this.pencilSlider.addEventListener('change', (event) => {
            this.templatePencilChanged();

        });

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
            this.ctx.lineWidth = this.pencilSlider.value;
            this.ctx.lineCap = "round";
            if (event.buttons === 1) {
                this.ctx.strokeStyle = this.color;
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