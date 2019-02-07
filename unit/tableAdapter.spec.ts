import {TableData, TableRow} from "../src/table_adapter";
import {expect} from 'chai';


describe("TableAdapter", () => {
    describe("Remove row", () => {

        it("One row should be correctly added", () => {
            let tableData = new TableData([new TableRow()]);
            tableData.addRow(new TableRow());
            expect(tableData.rows.length).to.equal(2);
        });
        it("Multiple rows should be correctly added", () => {
            let tableData = new TableData([new TableRow()]);
            tableData.addRows([new TableRow(), new TableRow()]);
            expect(tableData.rows.length).to.equal(3);
        });
        it("Row should be correctly removed", () => {
            let tableData = new TableData([new TableRow(), new TableRow(), new TableRow(), new TableRow()]);
            tableData.removeRow(2);
            expect(tableData.rows.length).to.equal(3);
            expect(tableData.rows[2].index()).to.equal(3);
        });
    })
});