'use strict'

import AbstractView from "./AbstractView.js";

export default class ManageWordlistsView extends AbstractView {
    constructor(model) {
        super("div_managewordlistsview");
        this.model = model;
        

    }
}