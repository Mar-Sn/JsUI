// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";
// @ts-ignore
let $: jQuery = require("jquery");


export class Popup extends Component {
    private readonly header: string;

    private html: string = "";

    private readonly onClose: () => void;


    constructor(header: string, onclose: () => void) {
        super();
        this.header = header;
        this.onClose = onclose;
    }

    /**
     *
     */
    public close() {
        this.onClose();
        (function (random) {
            $(document).ready(function () {
                $("#" + random).remove();
            });
        })(super.random());
    };


    public show() {
        this.html = '<div id="' + super.random() + '" class="popup">' +
            '    <div class="inner">' +
            '        <div class="close"></div>' +
            '        <header>' + this.header + '</header>' +
            '        <div class="popup-body">' +
            '        </div>' +
            '    </div>' +
            '</div>';

        $("body").append(this.html);
        $("#" + super.random() + ' .inner .popup-body').html(this.getHtml());
        (function(random, parent){
            $("#" + random + ' .inner .close').click(function(){
                parent.close();
            });
        })(super.random(), this);
        super.uICreated();
    };

    
    /**
     * overrides the current content
     * @param {Component} component
     */
    public set(component: Component) {
        super.clearChildren();
        super.addChild(component)
    };


    /**
     * Adds a component to its list
     * @param {Component} component
     */
    public append(component: Component) {
        super.addChild(component);

        let children = super.children();
        console.log(children.length);
    };


    getHtml(): string {
        let stringBuilder = "";
        // @ts-ignore
        super.children().forEach(child => {
            stringBuilder += child.getHtml();
        });
        return stringBuilder;
    }

}