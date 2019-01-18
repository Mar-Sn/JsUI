// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";


// @ts-ignore
let $: jQuery = require("jquery");

export class Input extends Component{

    readonly name: string;
    private readonly type: string;
    private readonly value: any;
    private readonly placeholder: string;


    private isLoaded: boolean = false;

    private callBacks: { (value: any): void; }[] = [];
    private html: string = "";


    constructor(name: string, type: string, value: any, placeholder: string) {
        super();
        this.name = name;
        this.type = type;
        this.value = value;
        this.placeholder = placeholder;
    }

    /**
     * add a callback action to this input
     * @param {() => void}callback
     */
    public onChange(callback: () => void) {
        this.callBacks.push(callback)
    };

    getHtml(): string {
        if (this.type === "boolean") {
            let stringBuilder = "";
            stringBuilder += "<select id='" + super.random() + "'>";
            if (!this.value) {
                stringBuilder += "<option value=\"false\">No</option>";
                stringBuilder += "<option value=\"true\">Yes</option>";
            } else {
                stringBuilder += "<option value=\"true\">Yes</option>";
                stringBuilder += "<option value=\"false\">No</option>";
            }
            stringBuilder += "</select>";
            this.html = stringBuilder;
            return this.html;
        } else {
            let v = this.value;
            if (typeof this.value === 'undefined') {
                v = "";
            }
            this.html = '<input id="' + super.random() + '" name="' + name + '" type="' + this.type + '"  value="' + v + '" placeholder="' + this.placeholder + '">';
            return this.html;
        }
    }

    uICreated(): void {
        if (!this.isLoaded) {
            this.isLoaded = true;
            //do nothing

            let input = $("#" + super.random());

            (function (parent) {
                if (parent.type === "boolean") {
                    input.change(function () {
                        // @ts-ignore
                        let value = $(this).val();

                        for (let i = 0; i < parent.callBacks.length; i++) {
                            if (value === "false")
                                parent.callBacks[i](false);
                            else
                                parent.callBacks[i](true);
                        }
                    });
                } else if (parent.type === "date" || parent.type === "datetime") {
                    input.change(function () {
                        // @ts-ignore
                        let value = $(this).val();

                        for (let i = 0; i < parent.callBacks.length; i++) {
                            parent.callBacks[i](value);
                        }
                    });
                } else if (parent.type === "number") {
                    input.change(function () {
                        // @ts-ignore
                        let value = Number($(this).val());

                        for (let i = 0; i < parent.callBacks.length; i++) {
                            parent.callBacks[i](value);
                        }
                    });
                } else {
                    // @ts-ignore TODO
                    input.keypress(function (event) {
                        // @ts-ignore
                        let value = $(this).val() + String.fromCharCode(event.which);
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
    }

}