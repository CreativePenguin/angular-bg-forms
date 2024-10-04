import { DiceSetI, DiceSet } from "../diceset";

export interface SpellI {
    name: string
    url: string
    level: number
    damage: { [level: number]: DiceSetI }
}

export class Spell implements SpellI {
    name: string;
    url: string;
    level: number;
    damage: { [level: number]: DiceSetI; };
    
    constructor(name='', url='', level=1, damage={0: new DiceSet({})}) {
        this.name = name;
        this.url = url;
        this.level = level;
        this.damage = damage;
    }

    setDamageFromAPI(response: {[level: string]: string}, modifier: number) {
        for(let key in response) {
            console.log('damage from api', parseInt(key), response);
            this.damage[parseInt(key)] = new DiceSet(
                {modifier: modifier}, response[key]
            );
            console.log('damage variable', this.damage[parseInt(key)]);
        }
    }

    toString(): string {
        let retString = `name: ${this.name}, url: ${this.url}\n`;
        retString += `damage: `
        for(let key in this.damage) {
            retString += `{${key}: ${this.damage[key]}\n`
        }
        return retString;
    }

}

export interface SpellResponse {
    count: number
    results: SpellResponseResults[]
}

export interface SpellResponseResults {
    index: string
    name: string
    level: number
    url: string
}
