import {Div} from "./div";
import {Component} from "./component";

export class Popup extends Div {

    private readonly body: Div;

    constructor(header: string, onclose: () => void) {
        super('popup');
        let _this = this;

        let _header = new Div('header');
        _header.getElement().innerText = header;

        this.body = new Div('popup-body');
        let close = new Div('close');
        close.getElement().addEventListener('click', function(){
            onclose();
            _this.remove();
        });
        super.addElement(new Div('inner').addElement(close).addElement(_header).addElement(this.body));
    }


    getElement(): HTMLElement{
        return super.getElement();
    }


    /**
     * Append popup to body
     */
    public show() {
        if(this.getElement() != null){
            // @ts-ignore
            document.getElementsByTagName('body').item(0).appendChild(this.getElement());
        }
        super.uICreated();
    };


    /**
     * Remove the popup
     */
    public remove(){
        super.getElement().remove();
    }


    /**
     * overrides the current content
     * @param {Component} component
     */
    public set(component: Component) {
        super.clearChildren();
        super.addChild(component);
        this.body.getElement().innerHTML = "";
        this.body.addElement(component);
    };


    /**
     * Adds a component to its list
     * @param {Component} component
     */
    public append(component: Component) {
        super.addChild(component);
        this.body.addElement(component);
    };


}