import { DiceSetI, DiceSet } from "./diceset";

/**
 * Interface used to hold all necessary information about each spell
 */
export interface SpellI {
    name: string
    url: string
    level: number
    damage: { [level: number]: DiceSetI }
}

/**
 * The data type version of SpellI, which has additional functions to allow easier setting of values from DnD API
 */
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
            console.log('damage variable', this.damage[1]);
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

/**
 * data type generated from: https://transform.tools/json-to-typescript
 * Based on response from https://www.dnd5eapi.co/api/spells
 */
export interface SpellResponse {
    count: number
    results: SpellResponseResults[]
}

/**
 * Used to store individual information about each spell returned as a result from https://www.dnd5eapi.co/api/spells
 * data type generated from: https://transform.tools/json-to-typescript
 */
export interface SpellResponseResults {
    index: string
    name: string
    level: number
    url: string
}
