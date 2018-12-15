import {Component} from "./Component";
import {Random} from "./Random";

export class Panel implements Component {
    private readonly title: string;
    private readonly classes: string;
    private readonly random: string;

    private childs: Component[] = [];
    private html: string;


    constructor(title: string, classes: string) {
        this.title = title;
        this.classes = classes;
        this.random = new Random(20).get();
    }

    getHtml(): string {
        this.html = "<div id='" + this.random + "' class='panel " + this.classes + "'>";
        this.childs.forEach(child =>{
            this.html += child.getHtml();
        });
        this.html += "</div>";
        return this.html;
    }

    uICreated(): void {
        this.childs.forEach(child =>{
            child.uICreated();
        });
    }


    /**
     * Overrides current content
     * @param {Component} component
     */
    set(component: Component) {
        this.childs = [];
        this.childs.push(component);
    };

    /**
     * Add html to existing
     * @param {Component} component
     */
    append(component: Component) {
        this.childs.push(component);
    };


}