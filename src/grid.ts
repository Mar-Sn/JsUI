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

export class Grid extends Component{
    private readonly classes: string;

    private rows: TableComponent[][] = [];
    private dragger: any;
    private html: string = "";

    // @ts-ignore
    private gridData: string[][] | undefined;


    constructor(classes: string, gridData: [][] | undefined) {
        super();
        this.gridData = gridData;
        this.classes = classes;
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
        let thisRow = document.getElementById(super.random());
        if (thisRow == null) return elem;
        thisRow = thisRow.getElementsByTagName('tr').item(index);

        if (addButton) {
            let addColumn = new Button("+", '', function () {
                let emptyColumn = new TableComponent();
                emptyColumn.type = "readonly";
                if(thisRow == null) return;
                thisRow.prepend(parent.genTd(emptyColumn));
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
                    super.addChild(column.component);
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
     * Registers Component to children
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

        if (typeof column.value !== "undefined" && column.value !== null && typeof column.key !== "undefined" && column.key !== "") {
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
        super.addChild(input);
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
        let id = super.random();
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
        super.addChild(addRow);

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

    private setDraggable() {
        if (super.domLoaded() && this.rows.length > 0) {
            let el = document.getElementById(super.random());

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

        super.addChild(row);
        let _row = this.generateRow(row, this.rows.length);

        if (super.domLoaded()) {
            $("#" + super.random() + " tbody").append(_row);
            if (row.length > 0) {
                // @ts-ignore
                super.children.forEach(child => {
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
        this.html = "<table id='" + super.random() + "' class='sortable " + this.classes + "'><thead>" +
            "</thead><tbody>" + this.genRows() + "</tbody>" +
            "</table>";
        return this.html;
    }

    uICreated(): void {
        super.uICreated();
        this.setDraggable();
    }


}