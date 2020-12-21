'use strict'

export default class AbstractView {
    constructor(div_id) {
        this.view_visible = false;
        this.div_id = div_id;
    }

    get visible() {
        return this.view_visible
    }

    set visible(new_value) {
        this.view_visible = new_value;
        if (this.visible) {
            this.render();
            this.afterRender();
        }
        else {
            this.div.innerHTML = "";
        }
    }

    inject() {
        return `<div id=${this.div_id}></div>`
    }
    
    get div() {
        return document.getElementById(this.div_id);
    }

    get html() {
        return ""
    }

    render() {
        this.div.innerHTML = this.html
    }

    afterRender() {
    }


}