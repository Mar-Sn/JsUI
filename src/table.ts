// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {TableComponent} from "TableCompontent";
// @ts-ignore
import {Random} from "Random";
// @ts-ignore
import {Input} from "Input";
// @ts-ignore
import {Draggable} from "Draggable";

// @ts-ignore
let $: jQuery = require("jquery");

export class Table implements Component {
    private readonly headers: string[];
    private readonly classes: string;
    private readonly random: string;

    private rows: TableComponent[][] = [];
    private childs: Component[] = [];
    private dragger: any;
    private isloaded: boolean = false;
    private html: string = "";

    private baseArray: [] | undefined;


    constructor(headers: string[], classes: string, baseArray: [] | undefined) {
        this.baseArray = baseArray;
        if (!Array.isArray(headers)) {
            throw "Table arg1 -> headers should be an array!";
        }
        this.headers = headers;
        this.classes = classes;
        this.random = new Random(20).get();
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
        } else {
            return "";
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
            case "datetime":
                return "<td class='handle'>" + this.getInput(column, "datetime-local").getHtml() + "</td>";
            case "datetime-local":
                return "<td class='handle'>" + this.getInput(column, "datetime-local").getHtml() + "</td>";
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
            // @ts-ignore
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

    /**
     * @private
     */
    private getHeaders(): string {
        if (this.headers.length > 0) {
            let total = "<tr>";
            this.headers.forEach(header => {
                total += this.genTh(header);
            });
            total += "</tr>";
            return total
        } else {
            return "";
        }
    }

    private genRows() {
        let total = "";
        this.rows.forEach(row => {
            total += this.getTr(row);
        });
        return total;
    }

    private setDraggable() {
        if (this.isloaded && this.rows.length > 0) {
            let el = document.getElementById(this.random);

            try {
                //@ts-ignore
                let ___ignore = Draggable;
            } finally {

            }
            // @ts-ignore
            let d = require("Draggable");

            this.dragger = d(el, {
                mode: 'row',
                dragHandler: '.handle',
                onlyBody: true,
                animation: 300
            });
            (function (parent: Table) {
                parent.dragger.on('drop', function (from: number, to: number) {
                    from--;
                    to--;
                    let copyFrom = parent.rows[from];
                    parent.rows[from] = parent.rows[to];
                    parent.rows[to] = copyFrom;

                    if(typeof parent.baseArray !== 'undefined'){
                        let copyFromBase = parent.baseArray[from];
                        parent.baseArray[from] = parent.baseArray[to];
                        parent.baseArray[to] = copyFromBase;
                    }
                    console.log(from);
                    console.log(to);
                });
            })(this);

        }
    }

    /**
     * Add a row to the table
     * @param {TableComponent[]} row
     */
    public addRow(row: TableComponent[]) {

        this.rows.push(row);
        let _row = this.getTr(row);

        if (this.isloaded) {
            $("#" + this.random + " tbody").append(_row);
            if (row.length > 0) {
                this.childs.forEach(child => {
                    child.uICreated();
                });
            }
            this.setDraggable();
        }
    };

    /**
     * Add rows to the table
     * @param {TableComponent[][]} rows
     */
    public addRows(rows: TableComponent[][]) {
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
            this.setDraggable();
            this.childs.forEach(child => {
                child.uICreated();
            });
        }
    }


}