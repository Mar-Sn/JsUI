import {Div} from "./div";
import {Component} from "./component";

export class Panel extends Div {
    readonly title: string;

    constructor(title: string, classes: string | string[]) {
        let _classes = ['panel'];
        if (typeof classes === "string") {
            _classes.push(classes);
        } else if (typeof classes === "object" && Array.isArray(classes)) {
            classes = _classes.concat(classes);
        }

        super(_classes);
        this.title = title;
    }

    getElement(): HTMLElement {
        return super.getElement();
    }

    /**
     * Overrides current content
     * @param {Component} component
     */
    set(component: Component) {
        super.clearChildren();
        super.addChild(component);
        let element = this.getElement();
        if (element != null) {
            element.innerHTML = "";
            super.addElement(component);
        }
    };

    /**
     * Add html to existing
     * @param {Component} component
     */
    append(component: Component) {
        super.addChild(component);
        let element = this.getElement();
        if (element != null) {
            super.addElement(component);
        }
    };

}