// @ts-ignore
import {Component} from "Component";
// @ts-ignore
import {TableComponent} from "TableComponent";
// @ts-ignore
import {Random} from "Random";
// @ts-ignore
import {Input} from "Input";
// @ts-ignore
import {Draggable} from "Draggable";
// @ts-ignore
import {Button} from "Button";

// @ts-ignore
let $: jQuery = require("jquery");

export class Grid implements Component {
    private readonly classes: string;
    private readonly random: string;

    private rows: TableComponent[][] = [];
    private childs: Component[] = [];
    private dragger: any;
    private isloaded: boolean = false;
    private html: string = "";

    // @ts-ignore
    private gridData: string[][] | undefined;


    constructor(classes: string, gridData: [][] | undefined) {
        this.gridData = gridData;
        this.classes = classes;
        this.random = new Random(20).get();
    }

    /**
     *
     * @param {TableComponent[]} columns
     * @param index
     * @param addButton
     * @returns {string}
     * @private
     */
    private generateRow(columns: TableComponent[], index: number, addButton: boolean = true): HTMLElement {
        let elem = document.createElement("tr");

        let parent = this;
        let thisRow = document.getElementById(parent.random);
        if (thisRow == null) return elem;
        thisRow = thisRow.getElementsByTagName('tr').item(index);

        if (addButton) {
            let addColumn = new Button("+", '', function () {
                let emptyColumn = new TableComponent();
                emptyColumn.type = "text";
                emptyColumn.thisRow.prepend(parent.genTd(emptyColumn));
            });
            let tableComponent = new TableComponent();
            tableComponent.component = addColumn;
            tableComponent.type = "readonly";

            elem.appendChild(this.genTd(tableComponent));

        }


        if (columns.length > 0) {
            columns.forEach(column => {
                elem.appendChild(this.genTd(column));
            });
        }
        return elem;
    };


    /**
     * Gen a TD element with input or readonly
     * @param column
     */
    private genTd(column: TableComponent): HTMLElement {
        let elem = document.createElement("td");
        elem.classList.add('handle');
        switch (column.type) {
            case "text":
                elem.innerHTML = this.getInput(column, "text").getHtml();
                break;
            case "number":
                elem.innerHTML = this.getInput(column, "number").getHtml();
                break;
            case "date":
                elem.innerHTML = this.getInput(column, "date").getHtml();
                break;
            case "datetime":
                elem.innerHTML = this.getInput(column, "datetime-local").getHtml();
                break;
            case "datetime-local":
                elem.innerHTML = this.getInput(column, "datetime-local").getHtml();
                break;
            case "boolean":
                elem.innerHTML = this.getInput(column, "boolean").getHtml();
                break;
            case "readonly":
                if (column.component != null) {
                    //user set compontent himself
                    this.addChild(column.component);
                    elem.innerHTML = column.component.getHtml();

                    break;
                } else {
                    elem.innerHTML = column.value;
                    break;
                }
            default:
                break;
        }
        return elem;
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
                console.log(item.mappedValue[item.key]);
            });
        }(column));

        column.component = input;
        this.addChild(input);
        return input;
    }


    private genRows() {
        let total = "";
        for (let i = 0; i < this.rows.length; i++) {
            total += this.generateRow(this.rows[i], i);
        }
        total += this.lastRowGen();

        return total;
    }

    private lastRowGen() {
        let id = this.random;
        let table = document.getElementById(id);
        let parent = this;
        let addRow = new Button("add", '', function () {
            table = document.getElementById(id);
            if (table != null) {
                let tbody = table.getElementsByTagName("tbody").item(0);
                // @ts-ignore

                let newElem = document.createElement("tr");
                // @ts-ignore
                newElem.innerHTML = parent.generateRow([], parent.rows.length).outerHTML;

                // @ts-ignore
                tbody.appendChild(newElem);
                parent.lastRowGen();
            }
        });
        this.addChild(addRow);

        if (table != null) {
            let currentNewRows = document.getElementsByClassName("new-row-target");
            for (let i = 0; i < currentNewRows.length; i++) {
                // @ts-ignore
                currentNewRows.item(i).remove();
            }

            let newRowComponent = new TableComponent();
            newRowComponent.component = addRow;
            newRowComponent.type = "readonly";

            let newElem = parent.generateRow([newRowComponent], parent.rows.length, false);
            // @ts-ignore
            newElem.classList.add('new-row-target');

            // @ts-ignore
            return table.getElementsByTagName('tbody').item(0).appendChild(newElem).outerHTML;
        } else {
            return "<tr class='new-row-target'><td colspan='13'>" + addRow.getHtml() + "</td></tr>";
        }
    }

    /**
     * Adds a compontent to the childs of the component
     * if ui is already loaded, uICreated is called on this compontent
     * @param component
     */
    private addChild(component: Component) {
        this.childs.push(component);
        if(this.isloaded){
            component.uICreated();
        }
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
            (function (parent: Grid) {
                parent.dragger.on('drop', function (from: number, to: number) {
                    from--;
                    to--;
                    let copyFrom = parent.rows[from];
                    parent.rows[from] = parent.rows[to];
                    parent.rows[to] = copyFrom;

                    /* if (typeof parent.baseArray !== 'undefined') {
                         let copyFromBase = parent.baseArray[from];
                         parent.baseArray[from] = parent.baseArray[to];
                         parent.baseArray[to] = copyFromBase;
                     }*/
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

        this.addChild(row);
        let _row = this.generateRow(row, this.rows.length);

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