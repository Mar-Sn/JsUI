// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";

export class Panel extends Component{
    readonly title: string;
    private readonly panel: HTMLDivElement;

    constructor(title: string, classes: string | string[]) {
        super();
        this.title = title;

        this.panel = document.createElement("div");
        this.panel.id = super.random();
        this.panel.className = "panel";

        if(typeof classes === "string"){
            this.panel.classList.add(classes);
        }else if(typeof classes === "object"){
            let parent = this;
            classes.forEach(function(item){
                // @ts-ignore
                parent.panel.classList.add(item);
            });
        }
        // @ts-ignore
        super.children().forEach(child =>{
            this.panel.appendChild(child.getElement());
        });
    }

    getElement(): HTMLElement | null {
        return this.panel;
    }

    /**
     * Overrides current content
     * @param {Component} component
     */
    set(component: Component) {
        super.clearChildren();
        super.addChild(component);
        this.panel.innerHTML = "";
        this.panel.appendChild(component.getElement());
    };

    /**
     * Add html to existing
     * @param {Component} component
     */
    append(component: Component) {
        super.addChild(component);
        this.panel.appendChild(component.getElement());
    };

}