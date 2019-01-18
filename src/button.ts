// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";

// @ts-ignore
let $: jQuery = require("jquery");

export class Button extends Component{
    // @ts-ignore
    private readonly html: string;
    private callback: () => void;
    private callbackBinded: boolean = false;
    readonly name: String = "";

    /**
     *
     * @param name
     * @param classes
     * @param callback
     */
    constructor(name: String, classes: string, callback: () => void) {
        super();
        this.callback = callback;
        this.name = name;
        this.html = "<button id='" + super.random() + "' class='" + classes + "'>" + name + "</button>";
        if(super.domLoaded()){
            this.uICreated();
        }
    }

    getHtml(): string {
        return this.html;
    }

    uICreated(): void {
        super.uICreated(); //first call base method
        if(!this.callbackBinded){
            this.callbackBinded = true;
            (function (random, parent) {
                $(document).ready(function () {
                    // @ts-ignore
                    $("#" + random).click(function () {
                        parent.callback();
                    });
                });
            })(super.random(), this);
        }
    }
}