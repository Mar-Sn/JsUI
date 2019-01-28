// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {Random} from "Random";

// @ts-ignore


export class Button extends Component{
    // @ts-ignore
    private readonly html: string;
    private readonly button: HTMLButtonElement;

    /**
     *
     * @param name
     * @param classes
     * @param callback
     */
    constructor(name: string, classes: string | string[], callback: () => void) {
        super();

        this.button = document.createElement("button");
        this.button.id = super.random();
        this.button.innerHTML = name;
        if(typeof classes === "string"){
            this.button.className = classes;
        }else if(typeof classes === "object"){
            let parent = this;
            classes.forEach(function(item){
                // @ts-ignore
                parent.button.classList.add(item);
            });
        }
        this.button.addEventListener("click", callback);
        if(super.domLoaded()){
            this.uICreated();
        }
    }

    getElement(): HTMLElement | null {
        return this.button;
    }

    uICreated(): void {
        super.uICreated(); //first call base method
    }
}