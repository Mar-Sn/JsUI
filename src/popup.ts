// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";
// @ts-ignore


export class Popup extends Component {

    private readonly popup: HTMLDivElement;
    private body: HTMLDivElement;

    constructor(header: string, onclose: () => void) {
        super();

        let p = document.createElement("div");
        p.id = super.random();
        p.className = "popup";

        let inner = document.createElement("div");
        inner.className = "inner";

        let close = document.createElement("div");
        close.className = "close";
        close.addEventListener('click', function(){
            onclose();
            p.remove();
        });
        inner.appendChild(close);

        let _header = document.createElement("header");
        _header.innerText = header;
        inner.appendChild(_header);

        this.body = document.createElement("div");
        this.body.className = "popup-body";

        let body = this.body;
        // @ts-ignore
        super.children().forEach(function(item){
            body.appendChild(item.getElement());
        });
        inner.appendChild(body);

        p.appendChild(inner);
        this.popup = p;
    }


    getElement(): HTMLElement | null {
        return this.popup;
    }

    public show() {
        if(this.getElement() != null){
            // @ts-ignore
            document.getElementsByTagName('body').item(0).appendChild(this.popup);
        }
        super.uICreated();
    };

    
    /**
     * overrides the current content
     * @param {Component} component
     */
    public set(component: Component) {
        super.clearChildren();
        super.addChild(component);
        this.body.innerText = "";
        this.body.appendChild(component.getElement());
    };


    /**
     * Adds a component to its list
     * @param {Component} component
     */
    public append(component: Component) {
        super.addChild(component);
        this.body.appendChild(component.getElement());
    };


}