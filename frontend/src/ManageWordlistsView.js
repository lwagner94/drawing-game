'use strict'

import AbstractView from "./AbstractView.js";

export default class ManageWordlistsView extends AbstractView {
    constructor(model) {
        super("div_managewordlistsview");
        this.model = model;
        this.wordlists = null;
        this.homeButton = null;

        this.wordlists = document.getElementById("wordlists_currently");
        this.homeButton = document.getElementById("button_return_homescreen");

        this.uploadWordlists = (files) => {};
        this.returnHomescreen = () => {};

        this.setupHandlers();
    }

    setupHandlers() {
        document.querySelectorAll(".drop_zone__input").forEach(inputElement => {
            const dropZoneElement = inputElement.closest(".drop_zone");

            dropZoneElement.addEventListener("dragover", e => {
                e.preventDefault();
                dropZoneElement.classList.add("drop_zone__over");
            });

            ["dragleave", "dragend"].forEach(type => {
                dropZoneElement.addEventListener(type, e => {
                    dropZoneElement.classList.remove("drop_zone__over");
                });
            });

            dropZoneElement.addEventListener("drop", e => {
                e.preventDefault();

                if (e.dataTransfer.files.length) {
                    // TODO: only accept text files?
                    inputElement.files = e.dataTransfer.files;
                    this.uploadWordlists(e.dataTransfer.files);
                }

                dropZoneElement.classList.remove("drop_zone__over");
            });

            dropZoneElement.addEventListener("click", e => {
                inputElement.click();
            });

            inputElement.addEventListener("change", e => {
                if(inputElement.files.length) {
                    // TODO only accept text files?
                    this.uploadWordlists(inputElement.files);
                }
            });
        });

        this.model.addWordlistList = (wordlist_name) => {
            this.wordlists.innerHTML += ('<li>' + wordlist_name + '<\li>');
        };

        this.homeButton.onclick = () => {
            this.returnHomescreen();
        };
    }
}