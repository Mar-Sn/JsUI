// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";

export class Input extends Component {

    readonly name: string;
    private readonly type: string;
    private readonly value: any;
    private readonly placeholder: string;


    private isLoaded: boolean = false;

    private callBacks: { (value: any): void; }[] = [];

    private readonly input: HTMLInputElement | HTMLSelectElement | undefined;


    constructor(name: string, type: string, value: any, placeholder: string) {
        super();
        this.name = name;
        this.type = type;
        this.value = value;
        this.placeholder = placeholder;

        if (this.type === "boolean") {
            this.input = document.createElement("select");
            this.input.id = super.random();

            let no = document.createElement("option");
            no.value = "false";
            no.innerHTML = "No";

            let yes = document.createElement("option");
            yes.value = "true";
            yes.innerHTML = "Yes";

            if (!this.value) {
                this.input.options.add(no);
                this.input.options.add(yes);
            } else {
                this.input.options.add(yes);
                this.input.options.add(no);
            }
        } else {
            let v = this.value;
            if (typeof this.value === 'undefined') {
                v = "";
            }

            this.input = document.createElement("input");
            this.input.id = super.random();
            this.input.value = v;
            this.input.innerHTML = v;
            this.input.placeholder = this.placeholder;
            this.input.type = this.type;
        }
        (function (parent) {
            if (parent.input == null) return;
            window.addEventListener('load', function () {
                if (parent.ready()) {
                    parent.uICreated();
                }
            });
        })(this);
    }


    private ready(): Boolean {
        return document.readyState.toString() === "complete"
    }

    /**
     * add a callback action to this input
     * @param {() => void}callback
     */
    public onChange(callback: () => void) {
        this.callBacks.push(callback)
    };


    public getValue(): any {
        let htmlElement = document.getElementById(super.random()) as HTMLInputElement;

        if (this.type === "boolean") {
            return htmlElement.value === "true";
        } else if (this.type === "date" || this.type === "datetime") {
            return htmlElement.value;
        } else if (this.type === "number") {
            return Number(htmlElement.value);
        } else {
            //string
            return htmlElement.value;
        }
    }

    getElement(): HTMLElement | null {
        if (this.input == null) return null;
        return this.input;
    }

    private bindOnchange() {
        (function (parent) {

            if (parent.input == null) return;

            if (parent.type === "boolean") {
                // @ts-ignore
                parent.input.addEventListener("onchange", function () {
                    // @ts-ignore
                    let value = input.value;

                    for (let i = 0; i < parent.callBacks.length; i++) {
                        if (value === "false")
                            parent.callBacks[i](false);
                        else
                            parent.callBacks[i](true);
                    }
                });
            } else if (parent.type === "date" || parent.type === "datetime") {
                // @ts-ignore
                parent.input.addEventListener("onchange", function () {
                    // @ts-ignore
                    let value = input.value;

                    for (let i = 0; i < parent.callBacks.length; i++) {
                        parent.callBacks[i](value);
                    }
                });
            } else if (parent.type === "number") {
                // @ts-ignore
                parent.input.addEventListener("onchange", function () {
                    // @ts-ignore
                    let value = Number(input.value);

                    for (let i = 0; i < parent.callBacks.length; i++) {
                        parent.callBacks[i](value);
                    }
                });
            } else {
                // @ts-ignore TODO
                parent.input.addEventListener("onkeypress", function () {

                    // @ts-ignore
                    let value = input.value + String.fromCharCode(event.which);
                    for (let i = 0; i < parent.callBacks.length; i++) {
                        switch (parent.type) {
                            case "number":
                                parent.callBacks[i](Number(value));
                                break;
                            case "text":
                                parent.callBacks[i](value);
                                break;
                            default:
                                parent.callBacks[i](value);
                                break;
                        }

                    }
                });
            }
        })(this);
    }

    uICreated(): void {
        // @ts-ignore
        if (typeof this.input === "undefined" || this.input == null) return;

        if (!this.isLoaded && this.ready()) {
            this.isLoaded = true;
            //do nothing

            this.bindOnchange();

        }
    }

}