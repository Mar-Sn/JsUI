export class Random{
    private readonly text = "";
    private readonly possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    constructor(amount: number){
        for (let i = 0; i < amount; i++)
            this.text += this.possible.charAt(Math.floor(Math.random() * this.possible.length));
    }


    /**
     * get a random String
     *
     * @returns {string}
     */
    public get() {
        return this.text;
    };
}