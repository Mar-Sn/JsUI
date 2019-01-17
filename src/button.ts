// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";

// @ts-ignore
let $: jQuery = require("jquery");

export class Button implements Component {
    // @ts-ignore
    private readonly random: string;
    private readonly html: string;
    private callback: () => void;
    private domLoaded: boolean = false;
    readonly name: String = "";

    private _UiCreated:Boolean = false;

    /**
     *
     * @param name
     * @param classes
     * @param callback
     */
    constructor(name: String, classes: string, callback: () => void) {
        this.callback = callback;
        this.name = name;
        this.random = new Random(20).get();

        this.html = "<button id='" + this.random + "' class='" + classes + "'>" + name + "</button>";
        if(this.domLoaded){
            this.uICreated();
        }
    }

    getHtml(): string {
        return this.html;
    }

    uICreated(): void {
        this.domLoaded = true;
        if(!this._UiCreated){
            this._UiCreated = true;
            (function (parent) {
                $(document).ready(function () {
                    // @ts-ignore
                    $("#" + parent.random).click(function () {
                        parent.callback();
                    });
                });
            })(this);
        }
    }
}