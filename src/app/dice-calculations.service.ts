import { Injectable } from '@angular/core';
import { DiceSet, DiceSetI } from '../diceset';

@Injectable({
  providedIn: 'root'
})
export class DiceCalculationsService {
  diceSet: DiceSetI = new DiceSet({d20: 1});
  maxRoll(diceset: DiceSetI): number {
    let dicesum = 0;
    dicesum += diceset.d4 ?? 0 * 4;
    dicesum += diceset.d6 ?? 0 * 6;
    dicesum += diceset.d8 ?? 0 * 8;
    dicesum += diceset.d10 ?? 0 * 10;
    dicesum += diceset.d12 ?? 0 * 12;
    dicesum += diceset.d20 ?? 0 * 20;
    dicesum += diceset.modifier;
    return dicesum;
  }
  diceSetString(diceSet: DiceSetI): string {
    return `d4: ${diceSet.d4}\t
      d6: ${diceSet.d6}\t
      d8: ${diceSet.d8}\t
      d10: ${diceSet.d10}\t
      d12: ${diceSet.d12}\t
      d20: ${diceSet.d20}\t
      modifier: ${diceSet.modifier}`;
  }
}
