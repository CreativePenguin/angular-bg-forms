import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackRollsComponent } from './attack-rolls.component';
import { DropdownItem } from '../dropdown';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { Spell, SpellResponse } from '../spell';
import { SpellsService } from '../spells.service';
import { firstValueFrom } from 'rxjs';
import { mockSpellResponse } from '../../mocks/mockSpells';

describe('AttackRollsComponent', () => {
  let component: AttackRollsComponent;
  let fixture: ComponentFixture<AttackRollsComponent>;
  let httpTesting: HttpTestingController;
  let url = new URL('https://www.dnd5eapi.co/api')
  let demoDropdownList: {[groupName: string]: DropdownItem[]} = {
    'Grass': [
      {label: 'Bulbasaur', value: 'bulbasaur'},
      {label: 'Ivysaur', value: 'ivysaur'},
      {label: 'Venusaur', value: 'venusaur'}
    ],
    'Fire': [
      {label: 'Bulbasaur', value: 'bulbasaur'},
      {label: 'Ivysaur', value: 'ivysaur'},
      {label: 'Venusaur', value: 'venusaur'}
    ],
    'Water': [
      {label: 'Squirtle', value: 'squirtle'},
      {label: 'Wartortle', value: 'wartortle'},
      {label: 'Blastoise', value: 'blastoise'},
    ]
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttackRollsComponent, BrowserAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(),  provideAnimations(),
        SpellsService
      ],
    })
    .compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AttackRollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have baseline autocomplete testid setup on frontend (this test should always be true)', () => {
    const baseAutocomplete = fixture.debugElement.query(
      By.css('[data-testid="autocomplete-mat-autocomplete"]')
    )
    expect(baseAutocomplete).toBeTruthy();
  })

  it("should have properly gotten http values for spellsofEachLevel", async () => {
    let LEVEL_1_RESPONSE = mockSpellResponse;
    expect(component.spellsOfEachLevel$).toBeTruthy();
    const req = httpTesting.expectOne(`${url.href}/spells?level=1`)
    req.flush(LEVEL_1_RESPONSE);
  });

  it("should have filter being properly set in the backend for empty input", () => {
    component.getSpellList();
    fixture.detectChanges();

    expect(component.spellsOfEachLevel$['level 1']).toBeTruthy();
    expect(component.spellsOfEachLevel$['level 1']).toEqual(component._filterSpellAutocomplete('')['level 1'])
  })

  it("should display the full spell list when the filter has an empty input (this test doesn't test the frontend input)", () => {
    component._filterSpellAutocomplete('');
    fixture.detectChanges();

    const optgroup = fixture.debugElement.query(
      By.css('[data-testid="autocomplete-group"]')
    )
    expect(optgroup).toBeTruthy();
  });

  it("should display empty spell list when the filter has unavailable input (this test doesn't test the frontend input)", () => {
    component._filterSpellAutocomplete('this is not the name of a spell');
    fixture.detectChanges();

    const optgroup = fixture.debugElement.query(
      By.css('[data-testid="autocomplete-group"')
    )
    expect(optgroup).toBeFalsy();
  });
});
