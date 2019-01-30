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
import {Popup} from "Popup";

// @ts-ignore
import {trumbowyg} from "trumbowyg";

// @ts-ignore
//let __trumbowyg = require("trumbowyg");

// @ts-ignore
let $: jQuery = require("jquery");


export class Grid extends Component {

    private rows: TableComponent[][] = [];
    private dragger: any;

    // @ts-ignore
    private gridData: string[][] | undefined;


    private readonly gridElement: HTMLTableElement | undefined;
    private readonly tBody: HTMLTableSectionElement;

    constructor(classes: string | string[], gridData: [][] | undefined) {
        super();
        this.gridData = gridData;

        this.gridElement = document.createElement("table");

        this.gridElement.classList.add("jsUiGrid");

        if (typeof classes === "string" && classes !== "") {
            this.gridElement.classList.add(classes);
        } else if (typeof classes === "object") {
            let parent = this;
            classes.forEach(function (item) {
                // @ts-ignore
                parent.gridElement.classList.add(item);
            });
        }

        this.tBody = this.gridElement.createTBody();
        this.generateRows();
    }

    /**
     *
     * @param {TableComponent[]} columns
     * @param index
     * @param addButton
     * @returns {string}
     * @private
     */
    private generateRow(columns: TableComponent[], index: number, addButton: boolean = true): HTMLTableRowElement | null {

        let parent = this;

        if (this.gridElement == null || this.tBody == null) return null;

        let row = this.tBody.insertRow(index);
        if (addButton) {
            let addColumn = this.generateAddColumnToRowButton(row, parent);

            let tableComponent = new TableComponent();
            tableComponent.component = addColumn;
            tableComponent.type = "readonly";

            this.genTd(tableComponent, row, 1);

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
            if (Grid.rowColumnSpanCount(thisRow) <= 12) {
                let emptyColumn = new TableComponent();
                emptyColumn.type = "trumbowyg";
                emptyColumn.key = "colspan";
                if (thisRow == null) return;
                parent.genTd(emptyColumn, thisRow, 12 - Grid.rowColumnSpanCount(thisRow));
                parent.setDraggable();
            }

        });
    }


    private static rowColumnSpanCount(row: HTMLTableRowElement): number {
        let count = 0;
        for (let i = 0; i < row.cells.length; i++) {
            // @ts-ignore
            count += row.cells.item(i).colSpan
        }
        return count;
    }

    /**
     * Gen a TD element with input or readonly
     * @param column
     * @param row
     * @param colspan
     */
    private genTd(column: TableComponent, row: HTMLTableRowElement, colspan: number = 12): HTMLTableCellElement {
        let elem = row.insertCell(0);
        elem.classList.add('handle');
        elem.colSpan = colspan;

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
                let input = this.generateTrumbowyg(column, elem);
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


    private generateTrumbowyg(column: TableComponent, elem: HTMLTableCellElement) {
        column.value = 12;
        elem.colSpan = 12;
        let input = this.getInput(column, "number");

        input.onChange(function (data: number) {
            elem.colSpan = data;
        });
        input.getElement().classList.add("colspan-edit");

        let edit = document.createElement("div");
        edit.classList.add("edit");

        let content = document.createElement("div");
        content.classList.add("content");
        content.innerHTML = "";

        let amount = document.createElement("div");
        amount.classList.add("amount");
        amount.appendChild(input.getElement());
        edit.appendChild(amount);

        try {
            // @ts-ignore
            let ___ignore__ = new trumbowyg();
        } catch (e) {
            //ignore
        }

        content.addEventListener("click", function(){
            let popup = new Popup('edit content', function () {
                let html = $(editor).trumbowyg('html');
                content.innerHTML = html;
            });
            let editor = document.createElement("div");
            popup.getElement().getElementsByClassName("popup-body").item(0).appendChild(editor);
            popup.show();
            $(editor).trumbowyg({
                content: content.innerHTML
            });
        });

        elem.appendChild(edit);
        elem.appendChild(content);
        return input;
    }

    /**
     * Get an input based on tableCompontent
     * Registers Component to children
     *
     * @param column
     * @param type
     */
    private getInput(column: TableComponent, type: string): Input {
        if (typeof column.mappedValue === "undefined" || column.mappedValue === null) {
            column.mappedValue = {}
        }
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
                    if(typeof column.value === "number"){
                        column.mappedValue[column.key] = column.value;
                    }else{
                        column.mappedValue[column.key] = Number(column.value);
                    }
                    break;
                default:
                    column.mappedValue[column.key] = column.value;
                    break;
            }
        }

        (function (item) {
            // @ts-ignore
            input.onChange(function (data) {
                item.mappedValue[item.key] = data;
                console.log(item.mappedValue[item.key]);
            });
        }(column));

        column.component = input;
        return input;
    }


    private generateRows() {

        for (let i = 0; i < this.rows.length; i++) {
            this.generateRow(this.rows[i], i);
        }
        this.generateLastRow();
    }

    private generateLastRow(): void {
        let parent = this;
        let addRow = new Button("add", '', function () {
            if (parent.gridElement != null) {
                let higherThanNull = parent.gridElement.rows.length - 1;
                if (higherThanNull < 0) higherThanNull = 0;
                parent.generateRow([], higherThanNull);
                parent.setDraggable();
                // @ts-ignore
            }
        });
        super.addChild(addRow);

        if (parent.gridElement != null) {

            let newRowComponent = new TableComponent();
            newRowComponent.component = addRow;
            newRowComponent.type = "readonly";

            let newElem = parent.generateRow([newRowComponent], parent.rows.length, false);
            // @ts-ignore
            newElem.classList.add('new-row-target');
        }
    }

    private setDraggable() {
        if (super.domLoaded() && this.rows.length > 0) {
            try {
                //@ts-ignore
                let ___ignore = Draggable;
            } finally {

            }
            // @ts-ignore
            let d = require("Draggable");

            this.dragger = d(this.gridElement, {
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
        this.generateRow(row, this.rows.length);

        if (super.domLoaded()) {
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
        if (typeof this.gridElement === "undefined") return null;
        return this.gridElement;
    }


    uICreated(): void {
        super.uICreated();
        this.setDraggable();
    }


}