'use strict'

import AbstractView from "./AbstractView";

export default class GameView extends AbstractView {
    constructor(model) {
        super("div_gameview");
        this.model = model;
        
        this.canvasDrawing = null;

        this.currentX = 0;
        this.currentY = 0;
        this.ctx = null;
        this.canvasChangedHandler = (content) => {};

        model.registerCanvasListener(content => {
            if (this.canvasDrawing !== null) {
                var img = new Image();
                img.onload = () => {
                    // canvas.width = img.width;
                    // canvas.height = img.height;
                    this.canvasDrawing.getContext("2d").drawImage(img, 0, 0);
                };
            
                img.src = content;
            }

        });
        // this.previousX = 0;
        // this.previousY = 0;
        // this.pressed = false;

        // model.registerUserListListener(() => {
        //     this.render();
        // });
    }

    get html() {
        var content = `
        <canvas id=canvas_drawing width=400 height=400 style="border:1px solid #000000;"></canvas>
        `;

        return content;

    }
   

    afterRender() {
        if (!this.visible)
            return;

        this.canvasDrawing = document.getElementById("canvas_drawing");
        this.ctx = this.canvasDrawing.getContext("2d");
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillRect(0, 0, this.canvasDrawing.width, this.canvasDrawing.height);
        this.canvasDrawing.oncontextmenu = (event) => {return false};

        this.canvasDrawing.addEventListener('mousemove', (event) => {
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
            this.canvasChangedHandler(this.canvasDrawing.toDataURL("image/jpeg", 0.5));
        });
        this.canvasDrawing.addEventListener('mousedown', (event) => {
            var rect = this.canvasDrawing.getBoundingClientRect();
            this.currentX = event.clientX - rect.left;
            this.currentY = event.clientY - rect.top;

        });
        this.canvasDrawing.addEventListener('mouseup', (event) => {

        });
        this.canvasDrawing.addEventListener('mouseout', (event) => {
        });

        this.canvasDrawing.addEventListener('mouseenter', (event) => {
            var rect = this.canvasDrawing.getBoundingClientRect();
            this.currentX = event.clientX - rect.left;
            this.currentY = event.clientY - rect.top;

        });


        // this.input_number_of_players = document.getElementById("input_number_of_players");
        // this.input_rounds = document.getElementById("input_rounds");
        // this.input_wordlist = document.getElementById("input_wordlist");
        // this.input_lobby_code = document.getElementById("input_lobby_code");
        // this.button_start_game = document.getElementById("button_start_game");
        

        // this.button_join_game.onclick = function() {
        //     console.log("Join Game");
        // }

        // this.button_create_game.onclick = function() {
        //     console.log("Create Game");
        // }
    }


}