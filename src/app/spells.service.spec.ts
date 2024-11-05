import { TestBed } from '@angular/core/testing';

import { SpellsService } from './spells.service';

describe('SpellsService', () => {
  let service: SpellsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get json from api', () => {
  });
});
