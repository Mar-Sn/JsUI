// @ts-ignore
import {Random} from "Random";

export abstract class Component{
    private _random: string;
    private _domLoaded: boolean = false;
    private _children: Component[];

    protected constructor() {
        this._children = [];
        this._random = new Random(20).get();
    }


    random(): string {
        if(this._random == null){
            this._random = new Random(20).get();
        }
        return this._random;
    }

    domLoaded(): boolean {
        return this._domLoaded;
    }

    children(): Component[] {
        if(this._children == null){
            this._children = [];
        }
        return this._children;
    }

    clearChildren(): void{
        this._children = [];
    }

    addChild(component: Component): void {
        this.children().push(component);
        if (this._domLoaded)
            component.uICreated();//call uicreated since dom is loaded
    }

    uICreated(): void {
        this._domLoaded = true;
        this._children.forEach(child => {
            child.uICreated();
        });
    }
}