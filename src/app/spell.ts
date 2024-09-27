import { DiceSetI, DiceSet } from "../diceset";

export interface SpellI {
    name: string
    url: string
    damage: { [level: number]: DiceSetI }
}

export class Spell implements SpellI {
    name: string;
    url: string;
    damage: { [level: number]: DiceSetI; };
    
    constructor(name='', url='', damage={0: new DiceSet({})}) {
        this.name = name;
        this.url = url;
        this.damage = damage;
    }

    setDamageFromAPI(response: {[level: string]: string}) {
        for(let key in response) {
            console.log('damage from api', parseInt(key), response);
            this.damage[parseInt(key)] = new DiceSet({}, response[key])
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
