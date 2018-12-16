///<reference path="Random.ts"/>
import {Component} from "./Component";
import {Random} from "./Random";

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
    constructor(classes, callback) {
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
                $("#" + this._random).click(function () {
                    parent.callback();
                });
            });
        })(this);
    }
}