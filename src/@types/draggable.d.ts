interface Drag {
    on(drop: string, param2: (from: number, to: number) => void):void;
    (table: HTMLTableElement, options: Object):Drag;
}
declare const tableDragger: Drag;
