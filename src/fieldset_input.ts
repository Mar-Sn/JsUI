// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";
// @ts-ignore
import {Input} from "Input";

// @ts-ignore
let $: jQuery = require("jquery");

export class FieldSetInput extends Component{

    private readonly name: string;
    private readonly type: string;
    private readonly value: string;
    private readonly description: string;
    private readonly classes: string;
    private readonly placeholder: string;
    private readonly html: string;

    private currentValue: any;

    private child: Input;

    constructor(name: string, type: string, value: string, description: string, classes: string, placeholder: string) {
        super();
        this.name = name;
        this.type = type;
        this.value = value;
        this.description = description;
        this.classes = classes;
        this.placeholder = placeholder;

        let input = new Input(this.name, this.type, this.value, this.placeholder);
        this.child = input;

        if (typeof this.classes !== 'undefined') {

            this.html = '<fieldset id="' + super.random() + '" class="' + this.classes + '"> <label>' + this.description + '</label>' + input.getHtml() + '</fieldset>';
        } else {
            this.html = '<fieldset id="' + super.random() + '"> <label>' + this.description + '</label>' + input.getHtml() + '</fieldset>';
        }
    }

    getHtml(): string {
        return this.html;
    }

    uICreated(): void {
       super.uICreated();
    }

    public onChange(callback: (any:any) => void){
        this.child.onChange(callback);
    }


    public getValue():any {
        this.currentValue = this.child.getValue();
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
            this.currentValue = $("#" + super.random() + " input[name=" + name + "]").val();
            return typeof this.currentValue !== "undefined" && this.currentValue !== ""
        }
    }
}