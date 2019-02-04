// @ts-ignore
import {FieldSetInput} from "./lib/fieldset_input";
import {Panel} from "./lib/panel";
import {Popup} from "./lib/popup";
import {Table} from "./lib/table";
import {Button} from "./lib/button";
import {Div} from "./lib/Div";
import {Grid} from "./lib/grid";


export class Test{
    constructor(){

// @ts-ignore
        let popup = new Popup("test", function () {
            //onclose
            alert("popup closed");
        });
        let panel = new Panel("Panel1", ["input", "test"]);

        let input = new FieldSetInput('name', 'text', '', 'simple description', ['some','classes'], '');
// @ts-ignore
        input.onChange(function (data) {
            console.log(data);
        });
        panel.append(input);

        let panel1 = new Panel("Panel2", ["table","test"]);


// @ts-ignore
        window.object = [{name: "", sub: {}}, {name: "", sub: {}}];

// @ts-ignore
        let object = window.object;

        let table = new Table([
            "text",
            "number",
            "date",
            "boolean",
            "text sub",
            "number sub",
            "boolean sub",
        ], "", object);


        let table2 = new Table(['custom component'], '');
        let table_button = new Button("another test",'', function () {
            alert('button works from table');
        });
        table2.addRow([
            {
                type: "readonly",
                key: '',
                value: '',
                component: table_button
            }]);


        table.addRows([[
            {type: "text", key: 'name', value: object[0].name, mappedValue: object[0]},
            {type: "number", key: 'number', value: object[0].number, mappedValue: object[0]},
            {type: "datetime", key: 'datetime', value: object[0].datetime, mappedValue: object[0]},
            {type: "boolean", key: 'boolean', value: object[0].boolean, mappedValue: object[0]},

            {type: "text", key: 'name', value: object[0].sub.name, mappedValue: object[0].sub},
            {type: "number", key: 'number', value: object[0].sub.number, mappedValue: object[0].sub},
            {type: "datetime", key: 'datetime', value: object[0].sub.datetime, mappedValue: object[0].sub},
            {type: "boolean", key: 'boolean', value: object[0].sub.boolean, mappedValue: object[0].sub}
        ], [
            {type: "text", key: 'name', value: object[1].name, mappedValue: object[1]},
            {type: "number", key: 'number', value: object[1].number, mappedValue: object[1]},
            {type: "date", key: 'date', value: object[1].date, mappedValue: object[1]},
            {type: "boolean", key: 'boolean', value: object[1].boolean, mappedValue: object[1]},

            {type: "text", key: 'name', value: object[1].sub.name, mappedValue: object[1].sub},
            {type: "number", key: 'number', value: object[1].sub.number, mappedValue: object[1].sub},
            {type: "date", key: 'date', value: object[1].sub.date, mappedValue: object[1].sub},
            {type: "boolean", key: 'boolean', value: object[1].sub.boolean, mappedValue: object[1].sub},
        ]]);
        panel1.set(table);
        panel1.append(new Button('new row', '', function() {
            table.addRow([
                {type: "text", key: 'name', value: object[0].name, mappedValue: object[0]},
                {type: "number", key: 'number', value: object[0].number, mappedValue: object[0]},
                {type: "datetime", key: 'datetime', value: object[0].datetime, mappedValue: object[0]},
                {type: "boolean", key: 'boolean', value: object[0].boolean, mappedValue: object[0]},
            ])
        }));


        let panel2 = new Panel("Panel2", ["table","test"]);
        panel2.set(new Button("test", '', function () {
            alert('button works');
        }));


        let panel3 = new Panel("Panel3", ["Test","custom","compontent"]);
        panel3.set(table2);



        let panel4 = new Panel("Panel 4", ["Test","grid"]);


// @ts-ignore
        let gridDate = [];

// @ts-ignore
        let grid = new Grid('grid', gridDate);
        panel4.set(grid);
        panel4.append(new Button('Grid data to console','', function(){
            console.log(grid.getData());
        }));

        let body = document.getElementsByTagName("body").item(0);
        if(body != null){
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

            let p = new Div('panel', new Div('inner1'), new Div('inner2'))
                .addElement(new Div('panel'))
                .addElement(document.createElement("div")) //testing a plain JS HTMLElement
                .getElement();
            if(p != null){
                body.appendChild(p);
            }
        }

// @ts-ignore
        window.testObject = object;
    }
}