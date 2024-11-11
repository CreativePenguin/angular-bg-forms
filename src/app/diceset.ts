/**
 * This interface holds how many dice are rolled for each type of die
 * Iterable: returns arrays of all the dice values:
 * [4, d4num], [6, d6num], [8, d8num], [10, d10num], [12, d12num], [20, d20num]
 * This data type is used in dice-calculations.service.ts where the dice information is used in different calculations.
 */
export interface DiceSetI extends Iterable<[number, number]> {
    d4?: number;
    d6?: number;
    d8?: number;
    d10?: number;
    d12?: number;
    d20?: number;
    modifier: number;
    /** Used in skill check dice calculations for the target value that the diceset is supposed to be equal */
    target: number;
    attempts: number;
    advantage: Advantage;
}

/**
 * This interface is a data type to hold the number generated from calculating the dice roll results.
 */
export interface DiceResults {
    /** the number created by adding together all the dice rolled in a DiceSetI */
    rollResult: number;
    /** the number of times adding the dice together resulted in the rollResult */
    numResults: number;
    /** number of rolls with rollResult / total number of rolls possible from all the diceRolls. Can also be described as the percentage when rolling a diceset, that you would get rollResult as the roll. */
    percentageResults: number;
    /** the percent chance when rolling a diceset that you would get a rollResult higher than or equal to the current rollResult */
    cumPercentageResults: number;
}

/**
 * DiceSet data type implementation of DiceSetI
 * DiceSet class is used to set default values for variables in DiceSetI
 * DiceSet class is also used to implement iterator used in dice-calculations.serivce.ts
 */
export class DiceSet implements DiceSetI {
    d4!: number;
    d6!: number;
    d8!: number;
    d10!: number;
    d12!: number;
    d20!: number;
    modifier: number = 0;
    target: number = 0;
    attempts: number = 1;
    advantage: Advantage = Advantage.None;
    private keys = [4, 6, 8, 10, 12, 20];

    [Symbol.iterator](): Iterator<[number, number], any, undefined> {
        let i = 0;
        let keys = this.keys;
        let values = [
            this.d4 ?? 0, this.d6 ?? 0, this.d8 ?? 0, 
            this.d10 ?? 0, this.d12 ?? 0, this.d20 ?? 0
        ]

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
                 modifier=0, target=0, advantage=Advantage.None, attempts=1},
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
        this.attempts = attempts;
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

/**
 * Enum to track whether to calculate skill check possibility with advantage, disadvantage, or no just a flat roll
 */
export enum Advantage {
    None='0',
    Advantage='1',
    Disadvantage='2',
    SavageAttacker='3',
}
