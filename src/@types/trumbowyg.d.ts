interface JQuery<TElement = HTMLElement> extends Iterable<TElement>{
    trumbowyg():void;
    trumbowyg(type:string):string;
    trumbowyg(type:string, content:string):void;
}