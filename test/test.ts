import {FieldSetInput} from "./lib/fieldset_input";
import {Panel} from "./lib/panel";
import {Popup} from "./lib/popup";
import {Table} from "./lib/table";
import {Button} from "./lib/button";
import {Div} from "./lib/Div";
import {Grid} from "./lib/grid";
import {Confirm} from "./lib/confirm";
import {ConfirmType} from "./lib/confirm";
import {CellType, SimpleTableAdapter, SimpleTableCell, TableData, TableRow} from "./lib/table_adapter";



export class Test {
    constructor() {

// @ts-ignore
        let popup = new Popup("test", function () {
            //onclose
            alert("popup closed");
        });
        let panel = new Panel("Panel1", ["input", "test"]);

        let input = new FieldSetInput('name', 'text', '', 'simple description', ['some', 'classes'], '');
// @ts-ignore
        input.onChange(function (data) {
            console.log(data);
        });
        panel.append(input);

        let panel1 = new Panel("Panel2", ["table", "test"]);


// @ts-ignore
        window.object = [{name: "", sub: {}}, {name: "", sub: {}}];

// @ts-ignore
        let object = window.object;


        let tableData = new TableData([
            new TableRow([
                    new SimpleTableCell('', CellType.TEXT),
                    new SimpleTableCell('', CellType.NUMBER),
                    new SimpleTableCell('', CellType.DATETIME),
                    new SimpleTableCell('', CellType.BOOLEAN),
                    new SimpleTableCell('', CellType.TEXT),
                    new SimpleTableCell('', CellType.NUMBER),
                    new SimpleTableCell('', CellType.DATETIME),
                    new SimpleTableCell('', CellType.BOOLEAN)
                ]
            )]
        );

        let tableAdapter = new SimpleTableAdapter(tableData);


        let table = new Table([
            "text",
            "number",
            "date",
            "boolean",
            "text sub",
            "number sub",
            "boolean sub",
        ], "", tableAdapter);


        let table2 = new Table(['custom component'], '', new SimpleTableAdapter(new TableData([new TableRow([new SimpleTableCell('',CellType.BOOLEAN)])])));

        // @ts-ignore
        let table_button = new Button("another test", '', function () {
            alert('button works from table');
        });


        panel1.set(table);
        panel1.append(new Button('new row', '', function () {
            //add row to table
        }));


        let panel2 = new Panel("Panel2", ["table", "test"]);
        panel2.set(new Button("test", '', function () {
            alert('button works');
        }));


        let panel3 = new Panel("Panel3", ["Test", "custom", "compontent"]);
        panel3.set(table2);


        let panel4 = new Panel("Panel 4", ["Test", "grid"]);


// @ts-ignore
        let gridDate = [];

// @ts-ignore
        let grid = new Grid('grid', gridDate);
        panel4.set(grid);
        panel4.append(new Button('Grid data to console', '', function () {

        }));

        let panel5 = new Panel("Panel5", ["test"]);
        panel5.set(new Button("test", '', function () {
            let test = new Confirm(ConfirmType.INFO, undefined, undefined,() => {
                let accept =  new Confirm(ConfirmType.WARN, undefined, undefined, () => {

                }, () => {
                    let input_conf = new FieldSetInput('confirm', 'text', '', 'simple description', ['confirm', 'input'], '');
                    let pop_com = new Confirm(ConfirmType.ERROR, undefined, "hoi", () => {});
                    pop_com.addBodyComponent(input_conf);
                    pop_com.show();
                }, "accept", "error");
                accept.show();
            }, () => {
                let decline =  new Confirm(ConfirmType.WARN, undefined, undefined, () => {
                    let input_conf = new FieldSetInput('confirm', 'text', '', 'simple description', ['confirm', 'input'], '');
                    let pop_com = new Confirm(ConfirmType.ERROR, undefined, "hoi", () => {});
                    pop_com.addBodyComponent(input_conf);
                    pop_com.show();

                }, () => {

                }, "accept", "error");
                decline.show();
            });
            test.show();

        }));
        let body = document.getElementsByTagName("body").item(0);
        if (body != null) {
            // @ts-ignore
            body.appendChild(panel.getElement());
            // @ts-ignore
            body.appendChild(panel1.getElement());
            // @ts-ignore
            body.appendChild(panel2.getElement());
            // @ts-ignore
            body.appendChild(panel3.getElement());
            // @ts-ignore
            body.appendChild(panel4.getElement());
            // @ts-ignore
            body.appendChild(panel5.getElement());

            let p = new Div('panel', new Div('inner1'), new Div('inner2'))
                .addElement(new Div('panel'))
                .addElement(document.createElement("div")) //testing a plain JS HTMLElement
                .getElement();
            if (p != null) {
                body.appendChild(p);
            }
        }

// @ts-ignore
        window.testObject = object;
    }
}