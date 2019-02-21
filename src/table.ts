/// <reference path="@types/draggable.d.ts"/>
/// <reference path="@types/trumbowyg.d.ts"/>

import {Component} from "./component";
import {Input} from "./input";
import {CellType, TableAdapter} from "./table_adapter";

export class Table extends Component {
    private readonly headers: string[];

    private dragger: any;

    private readonly tableAdapter: TableAdapter;

    private readonly table: HTMLTableElement;
    // @ts-ignore
    private readonly tHead: HTMLTableSectionElement;
    private tBody: HTMLTableSectionElement;

    constructor(headers: string[], classes: string | string[], tableAdapter: TableAdapter) {
        super();
        this.tableAdapter = tableAdapter;
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


    private genTr(row: HTMLTableRowElement, rowIndex: number) {
        for (let x = 0; x < this.tableAdapter.columnCount(); x++) {
            this.genTd(row, rowIndex, x);
        }
    };


    private genTd(row: HTMLTableRowElement, rowIndex: number, columnIndex: number): void {
        let td = row.insertCell();
        td.className = "handle";
        let cellType = this.tableAdapter.getType(columnIndex, rowIndex);

        switch (cellType) {
            case CellType.BOOLEAN:
                td.appendChild(this.getInput("boolean", columnIndex, rowIndex).getElement());
                break;
            case CellType.DATETIME:
                td.appendChild(this.getInput("date", columnIndex, rowIndex).getElement());
                break;
            case CellType.NUMBER:
                td.appendChild(this.getInput("number", columnIndex, rowIndex).getElement());
                break;
            case CellType.TEXT:
                td.appendChild(this.getInput("text", columnIndex, rowIndex).getElement());
                break;
            case CellType.READONLY:
                let component = this.tableAdapter.getComponent(columnIndex, rowIndex);
                if (component != null) {
                    td.appendChild(component.getElement());
                } else {
                    if (this.tableAdapter.getValue(columnIndex, rowIndex) != null) {
                        // @ts-ignore stupid
                        td.innerHTML = this.tableAdapter.getValue(columnIndex, rowIndex);
                    }
                }
                break;
            default:
                if (this.tableAdapter.getValue(columnIndex, rowIndex) != null) {
                    // @ts-ignore stupid
                    td.innerHTML = this.tableAdapter.getValue(columnIndex, rowIndex);
                }
                break;
        }

    }


    private getInput(type: string, columnIndex: number, rowIndex: number): Input {
        let key = this.tableAdapter.getName(columnIndex, rowIndex);
        let value = this.tableAdapter.getValue(columnIndex, rowIndex);

        let input = new Input(key, type, value, "");

        (function (adapter: TableAdapter) {
            // @ts-ignore
            input.onChange(function (data) {
                adapter.setValue(columnIndex, rowIndex, data);
                console.log(data);
            });
        }(this.tableAdapter));

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

    private genRows(): void {
        for (let y = 0; y < this.tableAdapter.rowCount(); y++) {
            let row = this.tBody.insertRow();
            this.genTr(row, y);
        }
    }

    private setDraggable() {
        if (super.domLoaded() && this.tableAdapter.rowCount() > 0) {
            this.dragger = tableDragger(this.table, {
                mode: 'row',
                dragHandler: '.handle',
                onlyBody: true,
                animation: 300
            });
            (function (parent: Table) {
                parent.dragger.on('drop', function (from: number, to: number) {
                    from--;
                    to--;
                    parent.tableAdapter.moveIndex(from, to);
                });
            })(this);

        }
    }

    /**
     * Trigger data changed
     *
     * TODO optimize
     */
    public dataChanged(): void {
        super.children().forEach(function (item: Component) {
            item.getElement().remove();
        });
        this.tBody.remove();
        this.tBody = this.table.createTBody();
        this.genRows();
    }

    public getElement(): HTMLElement {
        return this.table;
    }

    uICreated(): void {
        super.uICreated();
        this.setDraggable();
    }


}