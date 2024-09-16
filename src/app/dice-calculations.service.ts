import { Injectable } from '@angular/core';
import { DiceSet, DiceSetI } from '../diceset';

@Injectable({
  providedIn: 'root'
})
export class DiceCalculationsService {
  maxRoll(diceset: DiceSetI): number {
    let dicesum = 0;
    for(let i of diceset) {
      dicesum += (i[0] * i[1]);
    }
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

  printDiceSet(diceSet: DiceSetI) {
    for(let i of diceSet) {
      console.log(i[0], i[1]);
    }
  }
}
