import { TestBed } from '@angular/core/testing';

import { DiceCalculationsService } from './dice-calculations.service';
import { DiceSetI, DiceSet } from '../diceset';

fdescribe('DiceCalculationsService', () => {
  let service: DiceCalculationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiceCalculationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be showing d4 = 1, d6 = 2, and d20 = 3', () => {
    let expectedValues = [[4, 1], [6, 2], [8, 3], [10, 4], [12, 5], [20, 6]];
    let diceSet: DiceSetI = new DiceSet({
      d4: 1, d6: 2, d8: 3, d10: 4, d12: 5, d20: 6
    });
    // service.printDiceSet(diceSet);
    let diceSetArr = Array.from(diceSet);
    for(let i = 0; i < expectedValues.length; i++) {
      expect(diceSetArr[i]).toEqual(expectedValues[i]);
    }
  });
});
