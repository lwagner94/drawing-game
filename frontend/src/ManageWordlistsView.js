'use strict'

import AbstractView from "./AbstractView.js";

export default class ManageWordlistsView extends AbstractView {
    constructor(model) {
        super("div_managewordlistsview");
        this.model = model;
        this.wordlists = null;

        this.wordlists = document.getElementById("wordlists_currently");

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
                    inputElement.files = e.dataTransfer.files;
                    updateWordlists(this.wordlists, e.dataTransfer.files);
                }

                dropZoneElement.classList.remove("drop_zone__over");
            });
        });

    }

}

function updateWordlists(wordlistsElement, files) {
    console.log(files);
    
    Array.from(files).forEach(file => {
        console.log(file.name);
    
        // TODO: read file content into Webstorage

        let file_name = file.name.split(".");
        wordlistsElement.innerHTML += ('<li>' + file_name[0] + '<\li>');
    });
}