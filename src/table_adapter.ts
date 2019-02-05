import {Component} from "./component";

export interface TableAdapter {
    /**
     * Get the amount of rows in the table
     */
    rowCount(): number

    /**
     * Get the amount of column in the table
     */
    columnCount(): number

    /**
     * Get the type of the cell
     *
     * @param x column
     * @param y row
     */
    getType(x: number, y: number): CellType

    /**
     * Get the name of the cell
     * @param x column
     * @param y row
     */
    getName(x: number, y: number): string

    /**
     * Get optional value
     * @param x column
     * @param y row
     */
    getValue(x: number, y: number): string | null

    /**
     * Set the value of the cell
     * @param x
     * @param y
     * @param data
     */
    setValue(x: number, y: number, data: any): void

    /**
     * Get the component of this cell if any
     * @param x
     * @param y
     */
    getComponent(x: number, y: number): Component | null


    /**
     * Row index changed by user
     */
    moveIndex(from: number, to: number): void
}

export class SimpleTableAdapter implements TableAdapter {
    private tableData: TableData;

    constructor(tableData: TableData) {
        this.tableData = tableData;
    }

    columnCount(): number {
        if(this.rowCount() > 0)
            return this.tableData.rows[0].cells.length;
        return -1;
    }

    getComponent(x: number, y: number): Component | null {
        return this.tableData.rows[y].cells[x].component();
    }

    getName(x: number, y: number): string {
        return this.tableData.rows[y].cells[x].name();
    }

    getType(x: number, y: number): CellType {
        return this.tableData.rows[y].cells[x].type();
    }

    getValue(x: number, y: number): any | null {
        return this.tableData.rows[y].cells[x].data();
    }

    moveIndex(from: number, to: number): void {
        let old = this.tableData.rows[from];
        this.tableData.rows[from] = this.tableData.rows[to];
        this.tableData.rows[to] = old;
    }

    rowCount(): number {
        return this.tableData.rows.length;
    }

    setValue(x: number, y: number, data: any): void {
        this.tableData.rows[y].cells[x].setData(data);
    }

}


export enum CellType {
    TEXT, NUMBER, BOOLEAN, DATETIME, READONLY
}

export class TableData {
    private _rows: TableRow[];

    constructor(rows: TableRow[] | undefined = undefined) {
        if (typeof rows !== "undefined")
            this._rows = rows;
        else
            this._rows = [];
    }

    public addRow(row: TableRow) {
        this._rows.push(row);
    }

    public addRows(rows: TableRow[]) {
        this._rows.concat(rows);
    }

    get rows(): TableRow[] {
        return this._rows;
    }

    set rows(value: TableRow[]) {
        this._rows = value;
    }
}

export class TableRow {
    private _cells: TableCell[];


    constructor(cells: TableCell[] | undefined = undefined) {
        if (typeof cells !== "undefined")
            this._cells = cells;
        else
            this._cells = [];
    }

    public addCell(cell: TableCell) {
        this._cells.push(cell);
    }

    get cells(): TableCell[] {
        return this._cells;
    }

    set cells(value: TableCell[]) {
        this._cells = value;
    }
}

export abstract class TableCell { //used to be interface but typescript compile failes on array of SimpleTableCell
    abstract name(): string

    abstract data(): any

    abstract component(): Component | null

    abstract type():CellType

    abstract setData(data: any): void
}

export class SimpleTableCell extends TableCell {
    private _data: any;
    private _component: Component | null = null;
    private _type: CellType; //default


    constructor(data: any, type: CellType = CellType.READONLY, component: Component | null = null) {
        super();
        this._data = data;
        this._component = component;
        this._type = type;
    }

    name(): string {
        return "";
    }

    public data(): any {
        return this._data;
    }

    public component(): Component | null {
        return this._component;
    }

    public type(): CellType {
        return this._type;
    }


    setData(value: any) {
        this._data = value;
    }

    setComponent(value: Component | null) {
        this._component = value;
    }

    setType(value: CellType) {
        this._type = value;
    }


}