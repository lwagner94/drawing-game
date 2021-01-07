'use strict'

import AbstractView from "./AbstractView.js";

export default class ManageWordlistsView extends AbstractView {
    constructor(model) {
        super("div_managewordlistsview");
        this.model = model;
        this.wordlists = null;

        this.wordlists = document.getElementById("wordlists_currently");

        loadSessionStorageWordlists(this.wordlists);

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
                    updateWordlists(this.wordlists, e.dataTransfer.files);
                }

                dropZoneElement.classList.remove("drop_zone__over");
            });

            dropZoneElement.addEventListener("click", e => {
                inputElement.click();
            });

            inputElement.addEventListener("change", e => {
                if(inputElement.files.length) {
                    // TODO only accept text files?
                    updateWordlists(this.wordlists, inputElement.files);
                }
            });
        });

    }

}

function updateWordlists(wordlistsElement, files) {
    
    Array.from(files).forEach(file => {
        
        let file_name = file.name.split(".")[0];
        addWordlist(wordlistsElement, file_name);
        
        readFile(file).then((content) => {
            storeWordlist(file_name, content);
        });
    });
}

function readFile(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = event => reject(error);
        reader.readAsText(file);
    });
}

function storeWordlist(wordlist_name, wordlist_content) {
    
    if (typeof(Storage) !== undefined) {
        let wordlist = {};
        wordlist.title = wordlist_name;
        wordlist.words = wordlist_content.split(",");
        
        for (let i = 0; i < wordlist.words.length; i++) {
            wordlist.words[i] = wordlist.words[i].trim().toLowerCase();
        }


        // TODO: sanity checks?
        let sessionStorage = window.sessionStorage;
        sessionStorage.setItem(wordlist_name, JSON.stringify(wordlist));
    }
    else {
        // TODO: error handling
        console.log("Webstorage not supported.");
    }
}

function loadSessionStorageWordlists(wordlistsElement) {
    const storage = window.sessionStorage;

    if (storage.length) {
        for (let i = 0; i < storage.length; i++) {
            
            let wordlist_name = storage.key(i);
            addWordlist(wordlistsElement, wordlist_name);
            addWordlistSelection(wordlist_name);
        }
    }
}

function addWordlist(wordlistsElement, wordlist_name) {
    wordlistsElement.innerHTML += ('<li>' + wordlist_name + '<\li>');
}

function addWordlistSelection(wordlist_name) {
    let selectionElement = document.getElementById("input_wordlist");
    selectionElement.innerHTML += ('<option value="' + wordlist_name + '">' + wordlist_name + '</option>');
}