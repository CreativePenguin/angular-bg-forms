import { Injectable } from '@angular/core';
import { DiceResults, DiceSet, DiceSetI } from '../diceset';

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
   * Explanation of Algorithm:
   * 1. possibleDiceValues() is used to convert dice set into 2d array
   * 2. two arrays are created, sums1 and sums2.
   * 2a. sums1 is initiated to [0]. This array will be used to store the dice sums as they are being added up.
   * 2b. sums2 is initiated to []. This array
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
      for(let currentDieValue of diceFaces) {
        for(let currentSum of sums1) {
          sums2.push(currentSum + currentDieValue);
        }
      }
      sums1 = sums2.slice(); // create deep copy of array
      sums2 = [];
    }
    return sums1.filter((x) => x >= target).length / this.numPossibleDieRolls(diceset);
  }

  /**
   * This algorithm is a variation of skillCheckCalc that shows the percentage of success
   * @param diceset 
   * @returns 
   */
  diceCalcMap(diceset: DiceSetI): Map<number, number> {
    let finalSums = new Map<number, number>();
    let possibleValues = this.possibleDiceValues(diceset);
    let sums1: number[] = [0];
    let sums2: number[] = [];
    for(let diceFaces of possibleValues) {
      for(let currentDieValue of diceFaces) {
        for(let currentSum of sums1) {
          sums2.push(currentSum + currentDieValue);
        }
      }
      sums1 = sums2.slice();
      sums2 = [];
    }
    // create map
    for(let i of sums1) {
      finalSums.set(i, (finalSums.get(i) ?? 0) + 1);
    }
    return finalSums;
  }

  diceCalcResults(diceset: DiceSetI): DiceResults[] {
    let map: Map<number, number> = this.diceCalcMap(diceset);
    let numPossibleRolls = this.numPossibleDieRolls(diceset);
    let dieResults: DiceResults[] = [];
    map.forEach((numRolls, roll) => {
      dieResults.push({
        rollResult: roll,
        numResults: numRolls,
        percentageResults: this.twoDecimalPercentage(numRolls / numPossibleRolls),
      })
    })
    return dieResults;
  }

  twoDecimalPercentage(decimal: number): number {
    return Math.round(decimal * 10000) / 100;
  }

  /**
   * Covnerts die set into array of array of numbers that represents the
   * possible rolls created from the diceset
   * eg. diceset { d4: 1, d12: 2 } results in:
   * ```
   * [[1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]
   * ```
   * @param diceset dice set that represents the number of dice being rolled, and the 
   * @returns converted
   */
  possibleDiceValues(diceset: DiceSetI): number[][] {
    let possibleValues: number[][] = [];
    for(let i of diceset) {
      // i[1] = the number of the sides of the die
      for(let j = 0; j < i[1]; j++) {
        possibleValues.push([...Array(i[0] + 1).keys()].slice(1));
      }
    }
    return possibleValues;
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
