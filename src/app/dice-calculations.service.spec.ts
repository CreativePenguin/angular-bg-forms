import { TestBed } from '@angular/core/testing';

import { DiceCalculationsService } from './dice-calculations.service';

describe('DiceCalculationsService', () => {
  let service: DiceCalculationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiceCalculationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
