import { Injectable } from '@angular/core';
import { DiceSet } from '../diceset';

@Injectable({
  providedIn: 'root'
})
export class DiceCalculationsService {
  maxRoll(diceset: DiceSet): number {
    let dicesum = 0;
    dicesum += diceset.d4 * 4;
    dicesum += diceset.d6 * 6;
    dicesum += diceset.d8 * 8;
    dicesum += diceset.d10 * 10;
    dicesum += diceset.d12 * 12;
    dicesum += diceset.d20 * 20;
    dicesum += diceset.modifier;
    return dicesum;
  }
  diceSetString(diceSet: DiceSet): string {
    return `d4: ${diceSet.d4}\t
      d6: ${diceSet.d6}\t
      d8: ${diceSet.d8}\t
      d10: ${diceSet.d10}\t
      d12: ${diceSet.d12}\t
      d20: ${diceSet.d20}\t
      modifier: ${diceSet.modifier}`;
  }
}
