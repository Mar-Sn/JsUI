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

    /**
     *
     * @param classes
     * @param callback
     */
    constructor(classes:string, callback:() => void) {
        this.callback = callback;
        this.random = new Random(20).get();

        this.html = "<button id='" + this.random + "' class='" + classes + "'>" + name + "</button>";
    }

    getHtml(): string {
        return this.html;
    }

    uICreated(): void {
        (function (parent) {
            $(document).ready(function () {
                // @ts-ignore
                $("#" + this._random).click(function () {
                    parent.callback();
                });
            });
        })(this);
    }
}