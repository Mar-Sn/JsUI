import {Component} from "./Component";
import {TableComponent} from "./TableCompontent";
import {Random} from "./Random";
import {Input} from "./Input";

// @ts-ignore
let $: jQuery = require("jquery");

export class Table implements Component {
    private readonly headers: string[];
    private readonly classes: string;
    private readonly random: string;

    private rows: TableComponent[][] = [];
    private childs: Component[] = [];
    private dragger: any;
    private draggerLib: any;
    private isloaded: boolean = false;
    private html: string;


    constructor(headers: string[], classes: string, dragger: any) {
        this.headers = headers;
        this.classes = classes;
        this.random = new Random(20).get();
        this.draggerLib = dragger;
    }

    /**
     *
     * @param {TableComponent[]} columns
     * @returns {string}
     * @private
     */
    private getTr(columns: TableComponent[]) {
        let arrayLength = columns.length;
        if (arrayLength > 0) {
            let total = "<tr>";

            columns.forEach(row => {
                total += this.genTd(row)
            });

            if (arrayLength < this.headers.length) {
                for (let i = 0; i < this.headers.length - arrayLength; i++) {
                    total += "<td></td>";
                }
            }
            total += "</tr>";
            return total
        }
    };


    /**
     * Gen a TD element with input or readonly
     * @param column
     */
    private genTd(column: TableComponent) {
        switch (column.type) {
            case "text":
                return "<td class='handle'>" + this.getInput(column, "text").getHtml() + "</td>";
            case "number":
                return "<td class='handle'>" + this.getInput(column, "number").getHtml() + "</td>";
            case "date":
                return "<td class='handle'>" + this.getInput(column, "date").getHtml() + "</td>";
            case "boolean":
                return "<td class='handle'>" + this.getInput(column, "boolean").getHtml() + "</td>";
            default:
                return "<td class='handle'></td>"
        }
    }


    /**
     * Get an input based on tableCompontent
     * Registers Component to childs
     *
     * @param column
     * @param type
     */
    private getInput(column: TableComponent, type: string): Input {
        let input = new Input(column.key, type, column.value, "");

        if (typeof column.mappedValue === "undefined") {
            column.mappedValue = {}
        }

        if (type === "boolean") {
            column.mappedValue[column.key] = false;
        }

        if (typeof column.value !== "undefined" && column.value !== null) {
            switch (type) {
                case "boolean":
                    column.mappedValue[column.key] = column.value !== "false";
                    break;
                case "number":
                    column.mappedValue[column.key] = Number(column.value);
                    break;
                default:
                    column.mappedValue[column.key] = column.value;
                    break;
            }
        }

        (function (item) {
            input.onChange(function (data) {
                if (typeof item.mappedValue === "undefined") {
                    item.mappedValue = {}
                }
                item.mappedValue[item.key] = data;
            });
        }(column));

        column.component = input;
        this.childs.push(input);
        return input;
    }

    private genTh(header: string): string {
        return "<th>" + header + "</th>";
    }

    private getHeaders() {
        if (this.headers.length > 0) {
            let total = "<tr>";
            this.headers.forEach(header => {
                total += this.genTh(header);
            });
            total += "</tr>";
            return total
        }
    }

    private genRows() {
        let total = "";
        this.rows.forEach(row => {
            total += this.getTr(row);
        });
        return total;
    }

    private setDragable() {
        if (this.isloaded && this.rows.length > 0) {
            let el = document.getElementById(this.random);

            this.dragger = this.draggerLib(el, {
                mode: 'row',
                dragHandler: '.handle',
                onlyBody: true,
                animation: 300
            });
            this.dragger.on('drop', function (from, to) {
                console.log(from);
                console.log(to);
            });
        }
    }

    /**
     * Add a row to the table
     * @param {TableComponent[]} row
     */
    public addRow(row: TableComponent[]) {

        this.rows.push(row);
        let _row = this.getTr(row);

        if (this.isloaded){
            $("#" + this.random + " tbody").append(_row);
            if (row.length > 0) {
                this.childs.forEach(child =>{
                    child.uICreated();
                });
            }
            this.setDragable();
        }
    };

    /**
     * Add rows to the table
     * @param {TableComponent[][]} rows
     */
    public addRows(rows: TableComponent[][]){
        rows.forEach(row => {
            this.addRow(row);
        });
    }



    getHtml(): string {
        this.html = "<table id='" + this.random + "' class='sortable " + this.classes + "'><thead>" +
            this.getHeaders() +
            "</thead><tbody>" + this.genRows() + "</tbody>" +
            "</table>";
        return this.html;
    }

    uICreated(): void {
        if (!this.isloaded) {
            this.isloaded = true;
            this.setDragable();
            this.childs.forEach(child => {
                child.uICreated();
            });
        }
    }


}