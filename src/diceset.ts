/**
 * This interface holds how many dice are rolled for each type of die
 * Iterable: returns arrays of all the dice values:
 * [4, d4num], [6, d6num], [8, d8num], [10, d10num], [12, d12num], [20, d20num]
 */
export interface DiceSetI extends Iterable<[number, number]> {
    d4?: number;
    d6?: number;
    d8?: number;
    d10?: number;
    d12?: number;
    d20?: number;
    modifier: number;
    target: number;
    advantage: Advantage;
}

export interface DiceResults {
    rollResult: number;
    numResults: number;
    percentageResults: number;
}

export class DiceSet implements DiceSetI {
    d4!: number;
    d6!: number;
    d8!: number;
    d10!: number;
    d12!: number;
    d20!: number;
    modifier: number = 0;
    target: number = 0;
    advantage: Advantage = Advantage.None;
    private keys = [4, 6, 8, 10, 12, 20];

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

    [Symbol.iterator](): Iterator<[number, number], any, undefined> {
        let i = 0;
        let keys = this.keys;
        let values = [
            this.d4 ?? 0, this.d6 ?? 0, this.d8 ?? 0, 
            this.d10 ?? 0, this.d12 ?? 0, this.d20 ?? 0
        ];

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

    constructor({d4=0, d6=0, d8=0, d10=0, d12=0, d20=0,
                 modifier=0, target=0, advantage=Advantage.None},
                dicestring?: string) {
        let dicestringsplit = dicestring?.split(' + ');
        for(let dice of dicestringsplit || '') {
            // format of dice string: 4d4 -- 4 dice of 4 sides
            let numdice = +dice.split('d')[0] || 0;
            switch(dice.split('d')[1]) {
                case '4':
                    d4 += numdice;
                    break;
                case '6':
                    d6 += numdice;
                    break;
                case '8':
                    d8 += numdice;
                    break;
                case '10':
                    d10 += numdice;
                    break;
                case '12':
                    d12 += numdice;
                    break;
                case '20':
                    d20 += numdice;
                    break;
            }
        }
        this.d4 = d4;
        this.d6 = d6;
        this.d8 = d8;
        this.d10 = d10;
        this.d12 = d12;
        this.d20 = d20;
        this.modifier = modifier;
        this.target = target;
        this.advantage = advantage;
    }

    toString(): string {
        let returnString = `d4: ${this.d4}, d6: ${this.d6}, d8: ${this.d8}, `;
        returnString += `d10: ${this.d10}, d12: ${this.d12}, d20: ${this.d20}\n`;
        returnString += `modifier: ${this.modifier}, target: ${this.target}, `;
        returnString += `this.advantage: ${this.advantage}`;
        return returnString;
    }
}

export enum Advantage {
    None='0',
    Advantage='1',
    Disadvantage='2',
}
