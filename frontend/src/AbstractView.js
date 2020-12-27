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
        const element = document.getElementById(this.div_id)

        if (element) {
            if (new_value) {
                element.style.display = 'block';
            }
            else {
                element.style.display = 'none';
            }
        }
        else {
            console.log(`Could not find div with id ${this.div_id}!`);
        }

    }
}