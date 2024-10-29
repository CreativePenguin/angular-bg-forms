import { TestBed } from '@angular/core/testing';

import { DiceCalculationsService } from './dice-calculations.service';
import { DiceSetI, DiceSet } from '../diceset';

fdescribe('DiceCalculationsService', () => {
  let service: DiceCalculationsService;
  let diceSet: DiceSetI = new DiceSet({
    d4: 1, d6: 2, d8: 3, d10: 4, d12: 5, d20: 6
  });
  let diceSet2: DiceSetI = new DiceSet({
    d4: 2, target: 8
  });
  let diceSet3: DiceSetI = new DiceSet({
    d4: 1, d12: 2, target: 24
  });
  let diceSet4: DiceSetI = new DiceSet({
    d6: 2, target: 7
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiceCalculationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be showing d4 = 1, d6 = 2, and d20 = 3', () => {
    let expectedValues = [[4, 1], [6, 2], [8, 3], [10, 4], [12, 5], [20, 6]];
    // service.printDiceSet(diceSet);
    let diceSetArr = Array.from(diceSet);
    for(let i = 0; i < expectedValues.length; i++) {
      expect(diceSetArr[i]).toEqual(expectedValues[i]);
    }
  });

  it('should have functioning maxroll', () => {
    expect(diceSet.d4).toEqual(1);
    expect(diceSet.d20).toEqual(6);
    expect(service.maxRoll(diceSet)).toEqual(
      1 * 4 + 2 * 6 + 3 * 8 + 4 * 10 + 5 * 12 + 6 * 20
    );
    expect(service.maxRoll(diceSet2)).toEqual(8);
  });

  it('should have functioning numPossibleDieRolls', () => {
    let diceset = new DiceSet({d4: 2});
    expect(service.numPossibleDieRolls(diceset)).toEqual(16);
  });

  it('should have functioning possibleDieValues', () => {
    expect(service.possibleDiceValues(diceSet3)).toEqual(
      [[1, 2, 3, 4],
       [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
       [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]
    );
    expect(service.possibleDiceValues(diceSet2)).toEqual(
      [[1, 2, 3, 4], [1, 2, 3, 4]]
    );
  });

  it('should have skillCheckCalc Working', () => {
    expect(service.skillCheckCalc(diceSet2)).toEqual(1.0 / 16);
    expect(service.skillCheckCalc(diceSet4)).toEqual(21 / 36);
    expect(service.skillCheckCalc(diceSet3)).toEqual(34 / 576);
  });

  it('should have dice calc map working', () => {
    let expectedValue4 = new Map(
      [[2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6],
      [8, 5], [9, 4], [10, 3], [11, 2], [12, 1]]
    );
    expect(service.diceCalcMap(diceSet4)).toEqual(expectedValue4);
    let expectedValue2 = new Map(
      [[2, 1], [3, 2], [4, 3], [5, 4], [6, 3], [7, 2], [8, 1]]
    );
    expect(service.diceCalcMap(diceSet2)).toEqual(expectedValue2);
    let expectedValue3 = new Map(
      [[3, 1], [4, 3], [5, 6], [6, 10], [7, 14], [8, 18], [9, 22],
      [10, 26], [11, 30], [12, 34], [13, 38], [14, 42], [15, 44],
      [16, 44], [17, 42], [18, 38], [19, 34], [20, 30], [21, 26],
      [22, 22], [23, 18], [24, 14], [25, 10], [26, 6], [27, 3], [28, 1]]
    );
    expect(service.diceCalcMap(diceSet3)).toEqual(expectedValue3);
  });

  it('should create new dice object from string', () => {
    let sDiceSet = new DiceSet({}, '4d4');
    let sDiceSet2 = new DiceSet({}, '4d6 + 5d6');
    expect(sDiceSet).toEqual(new DiceSet({d4: 4}));
    expect(sDiceSet2).toEqual(new DiceSet({d6: 9}));
  })
});
