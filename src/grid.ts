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

export class Grid extends Component {

    private rows: TableComponent[][] = [];
    private dragger: any;

    // @ts-ignore
    private gridData: string[][] | undefined;


    private readonly gridElement: HTMLTableElement | undefined;
    // @ts-ignore
    private tHead: HTMLTableSectionElement;
    private readonly tBody: HTMLTableSectionElement;

    constructor(classes: string | string[], gridData: [][] | undefined) {
        super();
        this.gridData = gridData;

        this.gridElement = document.createElement("table");
        if(typeof classes === "string"){
            this.gridElement.classList.add(classes);
        }else if(typeof classes === "object"){
            let parent = this;
            classes.forEach(function(item){
                // @ts-ignore
                parent.gridElement.classList.add(item);
            });
        }

        this.tHead = this.gridElement.createTHead();
        this.tBody = this.gridElement.createTBody();
        this.genRows();
    }

    /**
     *
     * @param {TableComponent[]} columns
     * @param index
     * @param addButton
     * @returns {string}
     * @private
     */
    private generateRow(columns: TableComponent[], index: number, addButton: boolean = true): HTMLTableRowElement | null{

        let parent = this;

        if (this.gridElement == null || this.tBody == null) return null;

        let row = this.tBody.insertRow(index);
        if (addButton) {
            let addColumn = this.generateAddColumnToRowButton(row, parent);

            let tableComponent = new TableComponent();
            tableComponent.component = addColumn;
            tableComponent.type = "readonly";

            this.genTd(tableComponent, row);

        }


        if (columns.length > 0) {
            columns.forEach(column => {
                this.genTd(column, row);
            });
        }
        this.rows.push(columns);
        return row;
    };


    private generateAddColumnToRowButton(thisRow: HTMLTableRowElement, parent: Grid) {
        return new Button("+", '', function () {
            let emptyColumn = new TableComponent();
            emptyColumn.type = "trumbowyg";
            if (thisRow == null) return;
            parent.genTd(emptyColumn, thisRow);
        });
    }

    /**
     * Gen a TD element with input or readonly
     * @param column
     * @param row
     */
    private genTd(column: TableComponent, row: HTMLTableRowElement): HTMLTableCellElement {
        let elem = row.insertCell(0);
        elem.classList.add('handle');
        switch (column.type) {
            case "text":
                // @ts-ignore
                let _input = this.getInput(column, "text");
                elem.appendChild(_input.getElement());
                super.addChild(_input);
                break;
            case "number":
                // @ts-ignore
                let _input = this.getInput(column, "number");
                elem.appendChild(_input.getElement());
                super.addChild(_input);
                break;
            case "date":
                // @ts-ignore
                let _input = this.getInput(column, "date");
                elem.innerHTML = _input.getElement();
                super.addChild(_input);
                break;
            case "datetime":
                // @ts-ignore
                let _input = this.getInput(column, "datetime-local");
                elem.appendChild(_input.getElement());
                super.addChild(_input);
                break;
            case "datetime-local":
                // @ts-ignore
                let _input = this.getInput(column, "datetime-local");
                elem.appendChild(_input.getElement());
                super.addChild(_input);
                break;
            case "boolean":
                // @ts-ignore
                let _input = this.getInput(column, "boolean");
                elem.innerHTML = _input.getElement();
                super.addChild(_input);
                break;
            case "trumbowyg":
                column.value = 12;
                elem.colSpan = 12;
                let input = this.getInput(column, "number");

                input.onChange(function(data: number){
                    elem.colSpan = data;
                });
                let edit = document.createElement("div");
                edit.classList.add("edit");

                let amount = document.createElement("div");
                amount.classList.add("amount");
                amount.appendChild(input.getElement());
                edit.appendChild(amount);

                elem.appendChild(edit);
                super.addChild(input);
                break;
            case "readonly":
                if (column.component != null) {
                    //user set compontent himself

                    elem.appendChild(column.component.getElement());
                    super.addChild(column.component);
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
        return input;
    }


    private genRows() {

        for (let i = 0; i < this.rows.length; i++) {
            this.generateRow(this.rows[i], i);
        }
        this.lastRowGen();
    }

    private lastRowGen(): void {
        let id = super.random();
        let table = document.getElementById(id);
        let parent = this;
        let addRow = new Button("add", '', function () {
            table = document.getElementById(id);
            if (table != null) {
                let higherThanNull = parent.rows.length;
                if (higherThanNull < 0) higherThanNull = 0;
                parent.generateRow([], higherThanNull);
                // @ts-ignore
            }
        });
        super.addChild(addRow);

        if (table != null) {

            let newRowComponent = new TableComponent();
            newRowComponent.component = addRow;
            newRowComponent.type = "readonly";

            let newElem = parent.generateRow([newRowComponent], parent.rows.length, false);
            // @ts-ignore
            newElem.classList.add('new-row-target');

            // @ts-ignore
            return table.getElementsByTagName('tbody').item(0).appendChild(newElem).outerHTML;
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


    getElement(): HTMLElement | null {
        if(typeof this.gridElement === "undefined") return null;
        return this.gridElement;
    }


    uICreated(): void {
        super.uICreated();
        this.setDraggable();
    }


}