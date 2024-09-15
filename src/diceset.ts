export interface DiceSetI extends Iterable<[string, number]> {
    d4?: number;
    d6?: number;
    d8?: number;
    d10?: number;
    d12?: number;
    d20?: number;
    modifier: number;
    target: number;
}

export class DiceSet implements DiceSetI {
    d4?: number | undefined;
    d6?: number | undefined;
    d8?: number | undefined;
    d10?: number | undefined;
    d12?: number | undefined;
    d20?: number | undefined;
    modifier: number = 0;
    target: number = 0;
    private keys = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    private values = [
        this.d4 ?? 0, this.d6 ?? 0, this.d8 ?? 0, 
        this.d10 ?? 0, this.d12 ?? 0, this.d20 ?? 0
    ];

    // [Symbol.iterator](): Iterator<[string, number], any, undefined> {
    //     let iterableIterator = {
    //         keys: this.keys,
    //         values: this.values,
    //         current: 0,
    //         [Symbol.iterator]: null,
    //         next: function(): IteratorResult<[string, number]> {
    //             if (this.current < this.values.length) {
    //                 return {
    //                     value: [this.keys[this.current++], this.values[this.current++]], 
    //                     done: false
    //                 };
    //             } else {
    //                 return {value: null, done: true };
    //             }
    //         }
    //     }

    //     iterableIterator[Symbol.iterator] = () => iterableIterator;
    //     return iterableIterator;
    // }

    [Symbol.iterator](): Iterator<[string, number], any, undefined> {
        let i = 0;
        let keys = this.keys;
        let values = this.values;
        return {
            next() {
                if (i < values.length) {
                    return {value: [keys[i], values[i++]], done: false};
                } else {
                    return {value: null, done: true};
                }
            }
        }
    }

    constructor({d4=0, d6=0, d8=0, d10=0, d12=0, d20=0, modifier=0, target=0}) {
        this.d4 = d4;
        this.d6 = d6;
        this.d8 = d8;
        this.d10 = d10;
        this.d12 = d12;
        this.d20 = d20;
        this.modifier = modifier;
        this.target = target;
    }
}
