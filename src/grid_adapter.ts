import {Component} from "./component";

export interface GridAdapter {
    /**
     * Get the amount of rows in the table
     */
    rowCount(): number

    /**
     * Get the amount of column in the table
     */
    columnCount(y: number): number

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
     * Row index changed by user
     */
    moveIndex(from: number, to: number): void

    /**
     *
     * @param columnIndex
     * @param rowIndex
     */
    getComponent(columnIndex: number, rowIndex: number): GridCellType;
}

export class SimpleTableAdapter implements GridAdapter {
    private gridData: GridData;

    constructor(tableData: GridData) {
        this.gridData = tableData;
    }

    columnCount(y: number): number {
        if (this.rowCount() >= y)
            return this.gridData.rows[y].cells.length;
        return -1;
    }

    getValue(x: number, y: number): any | null {
        return this.gridData.rows[y].cells[x].data();
    }

    moveIndex(from: number, to: number): void {
        let old = this.gridData.rows[from];
        this.gridData.rows[from] = this.gridData.rows[to];
        this.gridData.rows[to] = old;
    }

    rowCount(): number {
        return this.gridData.rows.length;
    }

    setValue(x: number, y: number, data: any): void {
        this.gridData.rows[y].cells[x].setData(data);
    }

    getComponent(x: number, y: number): GridCellType {
        return this.gridData.rows[y].cells[x].getType();
    }

}


export class GridData {
    private _rows: GridRow[];

    constructor(rows: GridRow[] | undefined = undefined) {
        if (typeof rows !== "undefined")
            this._rows = rows;
        else
            this._rows = [];
    }

    public addRow(row: GridRow) {
        this._rows.push(row);
    }

    public addRows(rows: GridRow[]) {
        this._rows.concat(rows);
    }

    get rows(): GridRow[] {
        return this._rows;
    }

    set rows(value: GridRow[]) {
        this._rows = value;
    }
}

export class GridRow {
    private _cells: GridCell[];


    constructor(cells: GridCell[] | undefined = undefined) {
        if (typeof cells !== "undefined")
            this._cells = cells;
        else
            this._cells = [];
    }

    public addCell(cell: GridCell) {
        this._cells.push(cell);
    }

    get cells(): GridCell[] {
        return this._cells;
    }

    set cells(value: GridCell[]) {
        this._cells = value;
    }
}

export enum GridCellType {
    TRUMBOWYG, HTML, INPUT, NONE
}

export abstract class GridCell { //used to be interface but typescript compile failes on array of SimpleTableCell
    abstract name(): string

    abstract data(): any

    abstract component(): Component | null

    abstract setData(data: any): void

    abstract getType(): GridCellType

}

export class SimpleGridCell extends GridCell {
    private readonly _type: GridCellType;
    private _data: any;
    private _component: Component | null = null;

    constructor(data: any, component: Component | null = null, type: GridCellType = GridCellType.NONE) {
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

    setData(value: any) {
        this._data = value;
    }

    setComponent(value: Component | null) {
        this._component = value;
    }

    getType(): GridCellType {
        return this._type;
    }

}