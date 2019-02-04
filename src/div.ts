import {Component} from "./component";

export class Div extends Component {
    private readonly _div: HTMLElement;

    constructor(classes: string | string[], ...innerElement: Component[] | HTMLElement[]) {
        super();
        this._div = document.createElement("div");
        if (typeof classes === "string" && classes !== "") {
            this._div.classList.add(classes);
        } else if (typeof classes === "object") {
            let parent = this;
            classes.forEach(function (item) {
                // @ts-ignore
                parent._div.classList.add(item);
            });
        }

        if (typeof innerElement === "object" && innerElement.length > 0) {
            for (let i = 0; i < innerElement.length; i++) {
                this.addElement(innerElement[i]);
            }
        }
    }

    /**
     * Add a component or HTMLElement as child to this div
     * @param innerElement
     */
    public addElement(innerElement: Component | HTMLElement): Div {
        let asComponent: Component | null = innerElement instanceof Component ? (<Component>innerElement) : null;
        let asHTMLElement: HTMLElement | null = innerElement instanceof HTMLElement ? (<HTMLElement>innerElement) : null;
        if (asComponent != null) {
            // @ts-ignore //huh why?
            this._div.appendChild(asComponent.getElement());
            super.addChild(asComponent);
        }
        if (asHTMLElement != null) {
            this._div.appendChild(asHTMLElement);
        }

        return this;
    }

    getElement(): HTMLElement {
        return this._div;
    }
}