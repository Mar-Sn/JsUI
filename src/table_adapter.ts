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
     * @param x
     * @param y
     */
    getName(x: number, y: number): string

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

export class TableCell {
    private _data: any;


    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }
}