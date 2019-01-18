// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";

export class Panel extends Component{
    readonly title: string;
    private readonly classes: string;

    private html: string = "";


    constructor(title: string, classes: string) {
        super();
        this.title = title;
        this.classes = classes;
    }

    getHtml(): string {
        this.html = "<div id='" + super.random() + "' class='panel " + this.classes + "'>";
        // @ts-ignore
        super.children().forEach(child =>{
            this.html += child.getHtml();
        });
        this.html += "</div>";
        return this.html;
    }


    /**
     * Overrides current content
     * @param {Component} component
     */
    set(component: Component) {
        super.clearChildren();
        super.addChild(component);
    };

    /**
     * Add html to existing
     * @param {Component} component
     */
    append(component: Component) {
        super.addChild(component);
    };

}