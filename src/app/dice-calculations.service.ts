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

  minRoll(diceset: DiceSetI): number {
    let dicesum = 0;
    for(let i of diceset) {
      dicesum += (1 * i[1]);
    }
    dicesum += diceset.modifier;
    return dicesum;
  }

  /**
   * This returns the number of possible permutations of the dice rolls
   * there are. This can be used as the denomenator for calc-ing the
   * percentage of successful dice rolls
   * @param diceset diceset that you're calcing with
   * @returns The denomenator in calcing the probability
   */
  numPossibleDieRolls(diceset: DiceSetI): number {
    let dierolls = 1;
    for(let i of diceset) {
      dierolls *= i[0] ** i[1];
    }
    return dierolls;
  }

  /**
   * This function calculates the percent chance of a skill check succeeding
   * @param diceset diceset object that represents the dice being rolled,
   * and represents the target DC for the skillcheck
   * @returns the decimal chance of the skill check succeeding (between 0 and 1)
   */
  skillCheckCalc(diceset: DiceSetI): number {
    if(this.minRoll(diceset) > diceset.target) {
      return .95;  // .95 accounts for nat 20
    } else if(this.maxRoll(diceset) < diceset.target) {
      return .05;  // .05 accounts for nat one
    }
    let target = diceset.target - diceset.modifier;
    let possibleValues = this.possibleDiceValues(diceset);
    let sums1: number[] = [0];
    let sums2: number[] = [];
    for(let diceFaces of possibleValues) {
      for(let i of diceFaces) {
        for(let currentSum of sums1) {
          sums2.push(currentSum + i);
        }
      }
      sums1 = sums2.slice();
      sums2 = [];
    }
    return sums1.filter((x) => x >= target).length / this.numPossibleDieRolls(diceset);
  }

  diceValuePercentages(diceset: DiceSetI): Map<number, number> {
    let finalSums = new Map<number, number>();
    let possibleValues = this.possibleDiceValues(diceset);
    let sums1: number[] = [0];
    let sums2: number[] = [];
    for(let diceFaces of possibleValues) {
      for(let i of diceFaces) {
        for(let currentSum of sums1) {
          sums2.push(currentSum + i);
        }
      }
      sums1 = sums2.slice();
      sums2 = [];
    }
    for(let i of sums1) {
      finalSums.set(i, (finalSums.get(i) ?? 0) + 1);
    }
    return finalSums;
  }

  possibleDiceValues(diceset: DiceSetI): number[][] {
    let possibleValues: number[][] = [];
    for(let i of diceset) {
      for(let j = 0; j < i[1]; j++) {
        possibleValues.push([...Array(i[0] + 1).keys()].slice(1));
      }
    }
    return possibleValues;
  }

  /**
   * helper function for skillcheckcalc -- takes in all possible
   * dice values previous derived from a diceset, and returns the number of
   * dice roll results that passed the check
   * @param possibleValues array of possible dice roll values
   * @param target target of dice value rolls
   */
  private skillCheckCalcH(usedValues: number[], possibleValues: number[][], target: number): number {
    return 0;
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
