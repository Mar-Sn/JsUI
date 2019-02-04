import {Component} from "./component";
import {TableComponent} from "./table_component";
import {Input} from "./input";

export class Table extends Component {
    private readonly headers: string[];

    private rows: TableComponent[][] = [];
    private dragger: any;

    private baseArray: [] | undefined;

    private readonly table: HTMLTableElement;
    // @ts-ignore
    private readonly tHead: HTMLTableSectionElement;
    private readonly tBody: HTMLTableSectionElement;

    constructor(headers: string[], classes: string | string[], baseArray: [] | undefined = undefined) {
        super();
        this.baseArray = baseArray;
        if (!Array.isArray(headers)) {
            throw "Table arg1 -> headers should be an array!";
        }
        this.headers = headers;
        this.table = document.createElement("table");
        this.table.id = super.random();
        if (typeof classes === "string") {
            this.table.className = classes;
        } else if (typeof classes === "object") {
            let parent = this;
            classes.forEach(function (item) {
                // @ts-ignore
                parent.fieldset.classList.add(item);
            });
        }

        this.tHead = this.table.createTHead();
        this.tBody = this.table.createTBody();
        this.genHeader();
        this.genRows()
    }

    /**
     *
     * @param {TableComponent[]} columns
     * @returns {string}
     * @private
     */
    private genTr(columns: TableComponent[]) {
        let arrayLength = columns.length;
        if (arrayLength > 0) {
            let row = this.tBody.insertRow();

            columns.forEach(data => {
                this.genTd(data, row)
            });

            if (arrayLength < this.headers.length) {
                for (let i = 0; i < this.headers.length - arrayLength; i++) {
                    row.insertCell(); //add empty cells to fill up
                }
            }
        }
    };


    /**
     * Gen a TD element with input or readonly
     * @param data
     * @param row
     */
    private genTd(data: TableComponent, row: HTMLTableRowElement): void {
        let td = row.insertCell();
        td.className = "handle";
        switch (data.type) {
            case "text":
                td.appendChild(this.getInput(data, "text").getElement());
                break;
            case "number":
                td.appendChild(this.getInput(data, "number").getElement());
                break;
            case "date":
                td.appendChild(this.getInput(data, "date").getElement());
                break;
            case "datetime":
                td.appendChild(this.getInput(data, "datetime-local").getElement());
                break;
            case "datetime-local":
                td.appendChild(this.getInput(data, "datetime-local").getElement());
                break;
            case "boolean":
                td.appendChild(this.getInput(data, "boolean").getElement());
                break;
            case "readonly":
                if (data.component != null) {
                    //user set compontent himself
                    super.addChild(data.component);

                    td.appendChild(data.component.getElement());
                } else {
                    td.innerHTML = data.value;
                }
                break;
            default:
                td.innerHTML = data.value;
                break;
        }
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
        super.addChild(input);
        return input;
    }

    private static genTh(header: string, row: HTMLTableRowElement): void {
        let th: HTMLTableHeaderCellElement = document.createElement("th");
        th.innerHTML = header;
        row.appendChild(th);
    }

    /**
     * @private
     */
    private genHeader(): void {
        let row = this.tHead.insertRow();

        if (this.headers.length > 0) {
            this.headers.forEach(header => {
                Table.genTh(header, row);
            });
        }
    }

    private genRows() {
        let total = "";
        this.rows.forEach(row => {
            total += this.genTr(row);
        });
        return total;
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

            this.dragger = d(this.table, {
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

                    if (typeof parent.baseArray !== 'undefined') {
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
        let _row = this.genTr(row);

        if (super.domLoaded()) {
            // @ts-ignore
            document.getElementById(super.random()).append(_row);
            if (row.length > 0) {
                // @ts-ignore
                super.children().forEach(child => {
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

    public getElement(): HTMLElement {
        return this.table;
    }

    uICreated(): void {
        super.uICreated();
        this.setDraggable();
    }


}