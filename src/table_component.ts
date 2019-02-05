import {Component} from "./component";

export class TableComponent {

    /**
     *
     * @type {string}
     */
    public key: string = "";


    /**
     *
     * @type {Object}
     */
    public value: any = "";

    /**
     * @type {Object}
     */
    public mappedValue: any = null;

    /**
     *
     * @type {string}
     */
    public type: string = "";

    /**
     *
     * @type {Component}
     */
    public component: Component | undefined = undefined;


    constructor(type: string, key: string, value: any, mappedValue: any | null = {}, component: Component | undefined = undefined) {
        this.key = key;
        this.value = value;
        this.mappedValue = mappedValue;
        this.type = type;
        this.component = component;
    }
}