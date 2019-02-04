import {Component} from "./component";
import {Input} from "./input";

export class FieldSetInput extends Component {

    private readonly name: string;
    private readonly type: string;
    private readonly value: string;
    private readonly description: string;
    // @ts-ignore
    private readonly classes: string | string[];
    private readonly placeholder: string;

    private currentValue: any;

    private child: Input;
    private readonly fieldset: HTMLFieldSetElement;
    private readonly label: HTMLLabelElement;

    constructor(name: string, type: string, value: string, description: string, classes: string | string[], placeholder: string) {
        super();
        this.name = name;
        this.type = type;
        this.value = value;
        this.description = description;
        this.classes = classes;
        this.placeholder = placeholder;

        let input = new Input(this.name, this.type, this.value, this.placeholder);
        this.child = input;

        this.fieldset = document.createElement("fieldset");
        this.fieldset.id = super.random();
        if (typeof classes === "string") {
            this.fieldset.className = classes;
        } else if (typeof classes === "object") {
            let parent = this;
            classes.forEach(function (item) {
                // @ts-ignore
                parent.fieldset.classList.add(item);
            });
        }

        this.label = document.createElement("label");
        this.label.innerHTML = this.description;
        this.label.appendChild(input.getElement());
        this.fieldset.appendChild(this.label);
    }

    public getElement(): HTMLElement {
        return this.fieldset;
    }

    uICreated(): void {
        super.uICreated();
    }

    public onChange(callback: (_any: any) => void) {
        this.child.onChange(callback);
    }


    public getValue(): any {
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
            this.currentValue = this.child.getValue();
            return typeof this.currentValue !== "undefined" && this.currentValue !== ""
        }
    }
}