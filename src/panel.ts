// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";

// @ts-ignore
import {Div} from "Div";

export class Panel extends Div{
    readonly title: string;
    private readonly panel: Div;

    constructor(title: string, classes: string | string[]) {
        super();
        this.title = title;

        let mergedClasses = [];
        mergedClasses.push("panel");
        if(typeof classes === "string"){
            this.panel.mergedClasses.push(classes);
        }else if(typeof classes === "object"){
            classes.forEach(function(item){
                // @ts-ignore
                mergedClasses.push(item);
            });
        }

        this.panel = new Div(mergedClasses);


        // @ts-ignore
        super.children().forEach(child =>{
            this.panel.appendChild(child.getElement());
        });
    }

    getElement(): HTMLElement | null {
        return this.panel.getElement();
    }

    /**
     * Overrides current content
     * @param {Component} component
     */
    set(component: Component) {
        super.clearChildren();
        super.addChild(component);
        this.panel.innerHTML = "";
        this.panel.addElement(component);
    };

    /**
     * Add html to existing
     * @param {Component} component
     */
    append(component: Component) {
        super.addChild(component);
        this.panel.addElement(component);
    };

}