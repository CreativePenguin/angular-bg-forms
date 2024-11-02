import { Injectable } from '@angular/core';
import { Advantage, DiceResults, DiceSet, DiceSetI } from '../diceset';

@Injectable({
  providedIn: 'root'
})
export class DiceCalculationsService {
  /**
   * Generate max possible roll from diceset
   * @param diceset input of dice being rolled
   * @returns The roll total generated if each die has its highest number
   */
  maxRoll(diceset: DiceSetI): number {
    let dicesum = 0;
    for(let i of diceset) {
      dicesum += (i[0] * i[1]);
    }
    dicesum += diceset.modifier;
    return dicesum;
  }

  /**
   * Generate min possible roll from diceset
   * @param diceset input of dice being rolled
   * @returns The roll total generated if each die has its lowest number
   */
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
   * Converts raw skillCheckCalc value to chance of target being reached when d20 is rolled with advantage
   * @param targetChance Can accept either percentage or fraction calc of chance
   * @returns two decimal percentage of chance to hit target in skill check with advantage
   */
  calcSkillCheckAdvantage(targetChance: number): number {
    if(targetChance > 1) {
      targetChance /= 100;
    }
    return this.twoDecimalPercentage(1 - (1 - targetChance) ** 2);
  }

  /**
   * Converts raw skillCheckCalc value to chance of target being reached when d20 is rolled with disadvantage
   * @param targetChance Can accept either percentage or fraction calc of chance
   * @returns two decimal percentage of chance to hit target in skill check with disadvantage
   */
  calcSkillCheckDisadvantage(targetChance: number): number {
    if(targetChance > 1) {
      targetChance /= 100;
    }
    return this.twoDecimalPercentage(targetChance ** 2);
  }

  calcSkillCheckAdvantageDisadvantage(
    advantage: Advantage, targetChance: number
  ): number {
    switch(advantage) {
      case Advantage.Advantage:
        return this.calcSkillCheckAdvantage(targetChance);
      case Advantage.Disadvantage:
        return this.calcSkillCheckDisadvantage(targetChance);
      default:
        return targetChance;
    }
  }

  /**
   * This function just has a console.log to check for advantage.
   * It's a testing function to make sure that advantage is being set properly
   * @param advantage diceset.advantage value
   */
  checkAdvantageValue(advantage: Advantage) {
    switch(advantage) {
      case Advantage.None:
        console.log('excecuting checkAdvantageValue -- Advantage.None');
        break;
      case Advantage.Advantage:
        console.log('excecuting checkAdvantageValue -- Advantage.Advantage');
        break;
      case Advantage.Disadvantage:
        console.log('excecuting checkAdvantageValue -- Advantage.Disadvantage');
        break;
      default:
        console.log('excecuting checkAdvantageValue -- default');
    }
  }

  /**
   * This function calculates the percent chance of a skill check succeeding
   * Explanation of Algorithm: O(n^3)
   * The algorithm will iterate through the dice roll possibilities one die at a time, and add each of the possible die options on the current die to the list of sums.
   * 1. possibleDiceValues() is used to convert dice set into 2d array
   * 2. two arrays are created, sums1 and sums2.
   * 2a. sums1 is initiated to [0]. This array is used to store the sums generated from the dice already itereated through. This array will stay constant while the new die values are iterated through
   * 2b. sums2 is initiated to []. This array has the new sums from the dice value currently being iterated through pushed to it.
   * 3. Assume [[1, 2], [1, 2, 3], [1, 2, 3]]
   * The algorithm first itereates through the die values of the first die, and adds them to the values of the empty sums1 array. Sums are pushed to sums2.
   * sums1 = [0];
   * sums2 = [1, 2];
   * 4. Sums2 is then copied to sums1.
   * 5. Then, the next group of die results starts being iterated through, and gets added to values in sums1 array
   * first loop of sums1:
   * sums1 = [1, 2];
   * sums2 = [1 + 1, 2 + 1];
   * second loop of sums1:
   * sums1 = [1, 2];
   * sums2 = [1 + 1, 2 + 1, 1 + 2, 2 + 2];
   * third loop of sums1:
   * sums2 = [1 + 1, 2 + 1, 1 + 2, 2 + 2, 1 + 3, 2 + 3];
   * After loop of dieFaces:
   * sums1 = [1, 2];
   * sums2 = [1 + 1, 2 + 1, 1 + 2, 2 + 2, 1 + 3, 2 + 3];
   * Second loop of dieFaces:
   * sums1 = [2, 3, 3, 4, 4, 5]; // Copy of sums2, except I simplified the sums
   * sums2 = [1 + 1, 2 + 1, 1 + 2, 2 + 2, 1 + 3, 2 + 3];
   * first iteration of sums1:
   * sums2 = [2 + 1, 3 + 1, 3 + 1, 4 + 1, 4 + 1, 5 + 1];
   * second iteration of sums1:
   * sums2 = [2 + 1, 3 + 1, 3 + 1, 4 + 1, 4 + 1, 5 + 1, 
   *          2 + 2, 3 + 2, 3 + 2, 4 + 2, 4 + 2, 5 + 2];
   * third iteration of sums1:
   * sums2 = [2 + 1, 3 + 1, 3 + 1, 4 + 1, 4 + 1, 5 + 1, 
   *          2 + 2, 3 + 2, 3 + 2, 4 + 2, 4 + 2, 5 + 2,
   *          2 + 3, 3 + 3, 3 + 3, 4 + 3, 4 + 3, 5 + 3];
   * Final value of sums1 after loop: [3, 4, 4, 5, 5, 6, 4, 5, 5, 6, 6, 7, 5, 6, 6, 7, 7, 8]
   * 6. The algorithm filters the array for the sum values over the target
   * 7. Divide number of die rolls over the target over total number of die roll possibilities, and convert it to a percentage
   * @param diceset diceset object that represents the dice being rolled,
   * and represents the target DC for the skillcheck
   * @returns percentage chance of success rounded to two decimal points
   */
  skillCheckCalc(diceset: DiceSetI): number {
    if(this.minRoll(diceset) >= diceset.target) {
      // calculates chance of natural 20 (is 95)
      return this.calcSkillCheckAdvantageDisadvantage(diceset.advantage, 95);
    } else if(this.maxRoll(diceset) <= diceset.target) {
      // calculates chance of natural 1 (is 5)
      return this.calcSkillCheckAdvantageDisadvantage(diceset.advantage, 5);
    }
    let target = diceset.target - diceset.modifier;
    let possibleValues = this.possibleDiceValues(diceset);
    // This array holds the sums of the already iterated through dice.
    let sums1: number[] = [0];
    // This array will get the new dice sums pushed to it
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
    // return sums1.filter((x) => x >= target).length / this.numPossibleDieRolls(diceset);
    let numRollsAboveTarget = sums1.filter((x) => x >= target).length;
    let numPossibleRolls = this.numPossibleDieRolls(diceset);
    let fractionAboveTarget = numRollsAboveTarget / numPossibleRolls;
    return this.twoDecimalPercentage(
      this.calcSkillCheckAdvantageDisadvantage(diceset.advantage, fractionAboveTarget)
    );
  }

  /**
   * This algorithm is a variation of skillCheckCalc that generates a full map of results.
   * This variation does not look at the target of the roll
   * @param diceset input dice set
   * @returns Map[roll result : number of rolls with roll result]
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
      let modI = i + diceset.modifier;
      finalSums.set(modI, (finalSums.get(modI) ?? 0) + 1);
    }
    return finalSums;
  }

  diceCalcMapAdvantage(diceset: DiceSetI): Map<number, number> {
    let finalSums = new Map<number, number>();
    let possibleValues: number[][] = this.possibleDiceValues(diceset);
    possibleValues = this.diceCalcMapSetupPossibleValues(
      possibleValues, diceset.advantage
    );
    let sums1: number[] = [0];
    let sums2: number[] = [];
    for(let [dieIndex, diceFaces] of possibleValues.entries()) {
      for(let currentDieValue of diceFaces) {
        for(let currentSum of sums1) {
          if(
            (diceset.advantage === Advantage.Advantage ||
            diceset.advantage === Advantage.Disadvantage) &&
            dieIndex == 1
          ) {
            let nextDiceVal: number | null = this.diceCalcMapSetupChooseDice(
              currentSum, currentDieValue, diceset.advantage
            );
            if(nextDiceVal) {
              sums2.push(nextDiceVal);
            }
          } else {
            sums2.push(currentDieValue + currentSum);
          }
        }
      }
      sums1 = sums2.slice();
      sums2 = [];
    }
    for(let i of sums1) {
      let modI = i + diceset.modifier;
      finalSums.set(modI, (finalSums.get(modI) ?? 0) + 1);
    }
    return finalSums;
  }

  diceCalcMapSetupPossibleValues(
    possibleValues: number[][], advantage: Advantage
  ): number[][] {
    switch(advantage) {
      case Advantage.Advantage:
      case Advantage.Disadvantage:
        // Advantage requires a second D20
        possibleValues.push(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        );
        return possibleValues.reverse();
      case Advantage.SavageAttacker:
        return possibleValues.flatMap(
          (dieValue) => [dieValue, dieValue]
        );
      default:
        return possibleValues
    }
  }

  diceCalcMapSetupChooseDice(
    diceValue1: number, diceValue2: number, advantage: Advantage
  ): number | null {
    // if(diceValue1 == diceValue2) {
    //   return null;
    // }
    switch(advantage) {
      case Advantage.Advantage:
      case Advantage.SavageAttacker:
        console.log(`advantage calced for ${diceValue1}, ${diceValue2}`)
        return Math.max(diceValue1, diceValue2);
      case Advantage.Disadvantage:
        console.log(`disadvantage calced for ${diceValue1}, ${diceValue2}`)
        return Math.min(diceValue1, diceValue2);
      default:
        console.log('dice calc choose advantage dice improperly invoked');
        return null;
    }
  }

  /**
   * Calls diceCalcMap to create map from diceset, and uses the map created to convert into DiceResults array
   * DiceResults array is the data type used to make the roll results table
   * @param diceset input dice set, and modifier to dice rolls
   * @returns DiceResults array that holds the number of rolls, and the percentage of those rols to the whole
   */
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

  defaultD20RollResults(): DiceResults[] {
    let dieResults: DiceResults[] = [];
    for(let i = 1; i <= 20; i++) {
      dieResults.push({rollResult: i, numResults: 1, percentageResults: 5})
    }
    return dieResults;
  }

  /**
   * 
   * @param decimal number between 0 and 1
   * @returns The decimal number converted into a percentage rounded to two decimals
   */
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
