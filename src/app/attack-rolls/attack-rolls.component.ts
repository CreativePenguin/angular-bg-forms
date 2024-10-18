import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SpellsService } from '../spells.service';
import { filter, map, Observable, startWith } from 'rxjs';
import { Spell, SpellResponse, SpellResponseResults } from '../spell';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DropdownSearchComponent } from "../dropdown-search/dropdown-search.component";
import { DropdownItem } from '../dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-attack-rolls',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, ReactiveFormsModule,
    MatSelectModule, MatAutocompleteModule,
    DropdownSearchComponent
],
  templateUrl: './attack-rolls.component.html',
  styleUrl: './attack-rolls.component.scss'
})
export class AttackRollsComponent implements OnInit{
  spellsService: SpellsService = inject(SpellsService);
  rawSpellList$!: Observable<SpellResponse>;
  attackRollsForm = new FormGroup({
    spell: new FormControl<string | Spell>(''),
    spellLevel: new FormControl(1)
  })
  currentSpellRange: number[] = new Array(6);
  spellsOfEachLevel$: {[ spellLevel: string]: Observable<SpellResponse>} = {};
  filteredSpellsOfEachLevel!: Observable<{[ spellLevel: string]: Observable<SpellResponse>}>;
  // spellsOfEachLevel$!: Map<string,Observable<SpellResponse>>;

  /**
   * initialize spellsOfEachLevel variable
   */
  getSpellList() {
    // for(let i = 0; i <= 6; i++) {
    //   this.spellsService.getAllSpellsOfLevel(i).subscribe(
    //     (spellResponseForLevel) => {
    //       this.spellsOfEachLevel$[`level ${i}`] = spellResponseForLevel
    //       console.log('subscribed, and adding value', spellResponseForLevel, this.spellsOfEachLevel$)
    //     }
    //   );
    // }
    for(let i = 0; i <= 6; i++) {
      this.spellsOfEachLevel$[`level ${i}`] = this.spellsService.getAllSpellsOfLevel(i);
    }
  }

  /**
   * initialize obvervable for value of level dropdown -- set based on the
   * spell chosen from dropdown
   */
  addObservableToLevelDropdown() {
    // this.attackRollsForm.get('spell')!.valueChanges.subscribe(
    //   (selectedValue) => {
    //     console.log('found change to spell', selectedValue);
    //     const selectedValueAsString = typeof selectedValue === 'string' ? '' : selectedValue?.url;
    //     this.spellsService.getSpell(selectedValueAsString || '').subscribe(
    //       (spell) => {
    //         if(spell.level == 0) this.currentSpellRange = [0];
    //         else this.currentSpellRange = [...Array(7).keys()].slice(spell.level);
    //       }
    //     )
    //   }
    // )
  }

  filterSpellAutocomplete(): Observable<{[level: string]: Observable<SpellResponse>}> {
    return this.attackRollsForm.get('spell')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const valueAsString = typeof value === 'string' ? value : value?.name;
        return this._filterSpellAutocomplete(valueAsString || '')
      })
    )
  }

  _filterSpellAutocomplete(input: string): {[level: string]: Observable<SpellResponse>} {
    input = input.toLowerCase();
    console.log('_filterSpellAutocomplete called', input);
    // let filteredSpellList: {[level: string]: SpellResponse} = {}
    // for(let spellLevel in this.spellsOfEachLevel$) {
    //   let filteredSpellResponseResults: SpellResponseResults[];  
    //   this.spellsOfEachLevel$[spellLevel].subscribe(
    //     (v) => {
    //       if (input) {
    //         filteredSpellResponseResults = v.results.filter(
    //           (spell) => spell.name.toLowerCase().includes(input)
    //         );
    //         if(filteredSpellResponseResults.length > 0) {
    //           filteredSpellList[spellLevel] = { 
    //             count: filteredSpellResponseResults.length, 
    //             results: filteredSpellResponseResults
    //           }
    //         }
    //         console.log(input);
    //       } else {
    //         filteredSpellList[spellLevel] = v;
    //       }
    //     }
    //   );
    // }
    let filteredSpellResponseObservable: {[level: string]: Observable<SpellResponse>} = {}
    for(let spellLevel in this.spellsOfEachLevel$) {
      filteredSpellResponseObservable[`${spellLevel}`] = this.spellsOfEachLevel$[spellLevel].pipe(
        map(
          spellResponse => {
            let filteredSpellList = spellResponse.results.filter(
              (spell) => spell.name.toLowerCase().includes(input)
            );
            return {count: filteredSpellList.length, results: filteredSpellList};
          }
        ),
        filter(
          spellResponse => spellResponse.count > 0
        )
      )
    }
    return filteredSpellResponseObservable;
  }

  displaySpellAutocompleteValue(selectedValue: SpellResponseResults): string {
    return selectedValue && selectedValue.name ? selectedValue.name : '';
  }

  constructor() { }

  ngOnInit(): void {
    this.rawSpellList$ = this.spellsService.getAllSpells();
    this.getSpellList();
    // this.spellsOfEachLevel$ = this.getSpellList();
    // this.spellsService.getSpell(
    //   '/api/spells/flame-strike').subscribe((resp) => console.log(resp));
    this.addObservableToLevelDropdown();
    this.filteredSpellsOfEachLevel = this.filterSpellAutocomplete();
    this.filteredSpellsOfEachLevel.subscribe(
      (value) => console.log('filtered spell list', value)
    )
  }

}
