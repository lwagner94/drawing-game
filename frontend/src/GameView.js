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
        this.canvasChangedHandler = (content) => {};

        this.setupHandlers();
        // this.previousX = 0;
        // this.previousY = 0;
        // this.pressed = false;

        // model.registerUserListListener(() => {
        //     this.render();
        // });
    }

    setupHandlers() {
        this.model.registerCanvasListener(content => {
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
    }

}