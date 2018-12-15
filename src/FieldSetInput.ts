import {Component} from "./Component";
import {Random} from "./Random";
import {Input} from "./Input";

// @ts-ignore
declare let $: jQuery;

export class FieldSetInput implements Component {

    private readonly name: string;
    private readonly type: string;
    private readonly value: string;
    private readonly description: string;
    private readonly classes: string;
    private readonly placeholder: string;
    private readonly random: string;
    private readonly html: string;

    private currentValue: any;

    private child: Component;

    constructor(name: string, type: string, value: string, description: string, classes: string, placeholder: string) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.description = description;
        this.classes = classes;
        this.placeholder = placeholder;
        this.random = new Random(20).get();

        let input = new Input(this.name, this.type, this.value, this.placeholder);
        this.child = input;

        if (typeof this.classes !== 'undefined') {

            this.html = '<fieldset id="' + this.random + '" class="' + this.classes + '"> <label>' + this.description + '</label>' + input.getHtml() + '</fieldset>';
        } else {
            this.html = '<fieldset id="' + this.random + '"> <label>' + this.description + '</label>' + input.getHtml() + '</fieldset>';
        }
    }

    getHtml(): string {
        return this.html;
    }

    uICreated(): void {
        this.child.uICreated();
    }


    /**
     * Get the value of field
     *
     * @return {string}
     */
    public getValue() {
        this.currentValue = $("#" + this.random + " input[name=" + name + "]").val();
        return this.currentValue;
    };

    /**
     *
     * @returns {boolean}
     */
    public hasValue() {
        if (this.currentValue != null) {
            return this.currentValue !== ""
        } else {
            this.currentValue = $("#" + this.random + " input[name=" + name + "]").val();
            return typeof this.currentValue !== "undefined" && this.currentValue !== ""
        }
    }
}