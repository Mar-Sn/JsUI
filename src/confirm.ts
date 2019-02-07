import {Popup} from './popup'
import {Button} from "./button";
import {Component} from "./component";
import {Div} from "./div";

export class Confirm extends Popup {
    constructor(confirmType: ConfirmType = ConfirmType.INFO, header: string | undefined = confirmType.valueOf(), body_Text: string | undefined, yes: () => void, no: () => void = function () {
    }, yesButtonText: string = "yes", noButtonText: string = "no") {
        // makes normal popup
        super(header, function () {
        });
        let parent = this;
        super.getElement().classList.add("confirm");


        // makes a class depending on the confirm type
        switch (confirmType) {
            case ConfirmType.INFO:
                super.getElement().classList.add("info");
                break;
            case ConfirmType.WARN:
                super.getElement().classList.add("warn");
                break;
            case ConfirmType.ERROR:
                super.getElement().classList.add("error");
                break;
        }

        // body text in 1 div is optional.
        let bodyText = new Div('body-text');
        // @ts-ignore
        if(body_Text === undefined || body_Text === null || !body_Text) {
            bodyText.getElement().innerText = "are you sure you want to continue";
        } else {
            bodyText.getElement().innerText = body_Text;
        }



        let continu = new Button(yesButtonText, 'accept', function () {
            // @ts-ignore
            yes();
            parent.remove();
        });
        let decline = new Button(noButtonText, 'decline', function () {
            // @ts-ignore
            no();
            parent.remove();
        });

        // adds the 2 buttons to 1 div
        let Buttons = new Div('buttons');
        Buttons.addElement(continu.getElement());
        Buttons.addElement(decline.getElement());

        // get element for removing of close button.
        let closeButton = super.getElement().getElementsByClassName("close").item(0);

        this.appendToBody(Buttons, bodyText, closeButton);

        // todo background image
        // todo set button color.
        // todo set text color(header, button yes, button no, bodytext)
        // todo if no background image possible background color.





    }
    public addBodyComponent(component: Component){
        let bodycomponent = new Div('body-component');
        bodycomponent.addElement(component.getElement());
        this.getBody().addElement(bodycomponent.getElement())
    }

    appendToBody(buttons: Div, bodytext: Div, closeButton: Element | null){
        // appends all elements to de body of the popup(confirm).
        // and removes the close button.
        let popupBody = this.getBody();
        if (popupBody != null) {
            popupBody.addElement(bodytext.getElement());
            popupBody.addElement(buttons.getElement());
            // removes close button of popup
            if (closeButton !== null) {
                closeButton.remove();
            }
        }
    }

}

export enum ConfirmType {
    INFO = "Information", WARN = "Warning", ERROR = 'Error'
}
