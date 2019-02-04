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
    public component: Component | undefined;
}