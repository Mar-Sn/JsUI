import {Component} from "./Component";
import {Random} from "./Random";
// @ts-ignore
let $: jQuery = require("jquery");


export class Popup implements Component {
    private readonly header: string;
    private readonly random: string;

    private html: string;

    private childs: Component[] = [];
    private onclose: () => void;


    constructor(header: string, onclose: () => void) {
        this.header = header;
        this.onclose = onclose;
        this.random = new Random(20).get();
    }

    /**
     *
     */
    public close = function () {
        this.onclose();
        (function (parent) {
            $(document).ready(function () {
                $("#" + parent.random).remove();
            });
        })(this);
    };


    public show() {
        this.html = '<div id="' + this.random + '" class="popup">' +
            '    <div class="inner">' +
            '        <div class="close"></div>' +
            '        <header>' + this.header + '</header>' +
            '        <div class="popup-body">' +
            '        </div>' +
            '    </div>' +
            '</div>';

        $("body").append(this.html);
        $("#" + this.random + ' .inner .popup-body').html(this.getHtml());
        $("#" + this.random + ' .inner .close').click(this.close);
        this.uICreated();
    };

    
    /**
     * overrides the current content
     * @param {Component} component
     */
    public set(component: Component) {
        this.childs = [];
        this.childs.push(component);
    };


    /**
     * Adds a component to its list
     * @param {Component} component
     */
    public append(component: Component) {
        this.childs.push(component);
    };


    getHtml(): string {
        let stringBuilder = "";
        this.childs.forEach(child => {
            stringBuilder += child.getHtml();
        });
        return stringBuilder;
    }

    uICreated(): void {
        this.childs.forEach(child => {
            child.uICreated();
        });
    }

}