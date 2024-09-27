import { TestBed } from '@angular/core/testing';

import { SpellsService } from './spells.service';

fdescribe('SpellsService', () => {
  let service: SpellsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpellsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get json from api', () => {
  });
});
