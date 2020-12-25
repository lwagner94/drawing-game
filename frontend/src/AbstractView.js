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
        this.render();
        this.afterRender();
    
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
        if (this.visible) {
            this.div.innerHTML = this.html
        }
        else {
            this.div.innerHTML = "";
        }

    }

    afterRender() {
    }


}