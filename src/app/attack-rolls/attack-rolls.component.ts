import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SpellsService } from '../spells.service';
import { filter, forkJoin, map, merge, Observable, of, startWith, switchMap, toArray } from 'rxjs';
import { Spell, SpellGroup, SpellGroupIResponse, SpellResponse, SpellResponseResults } from '../spell';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DropdownSearchComponent } from "../dropdown-search/dropdown-search.component";
import { DropdownGroup, DropdownItem } from '../dropdown';
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
    spellLevel: new FormControl(1),
    testAutocomplete: new FormControl<string | Spell>(''),
    hardCodedAutocomplete: new FormControl('')
  });
  currentSpellRange: number[] = new Array(6);
  spellsOfEachLevel$: {[ spellLevel: string]: Observable<SpellResponse>} = {};
  filteredSpellsOfEachLevel!: Observable<{[ spellLevel: string]: Observable<SpellResponse>}>;
  filteredGroupSpellList!: Observable<SpellResponseResults[][]>;
  groupedSpellList!: Observable<SpellGroupIResponse[]>;

  /**
   * initialize spellsOfEachLevel variable
   */
  getSpellList() {
    for(let i = 0; i <= 6; i++) {
      this.spellsOfEachLevel$[`level ${i}`] = this.spellsService.getAllSpellsOfLevel(i);
    }
  }

  /**
   * initialize obvervable for value of level dropdown -- set based on the
   * spell chosen from dropdown
   */
  addObservableToLevelDropdown() {
    this.attackRollsForm.get('spell')!.valueChanges.subscribe(
      (selectedValue) => {
        console.log('found change to spell', selectedValue);
        const selectedValueAsString = typeof selectedValue === 'string' ? '' : selectedValue?.url;
        this.spellsService.getSpell(selectedValueAsString || '').subscribe(
          (spell) => {
            if(spell.level == 0) this.currentSpellRange = [0];
            else this.currentSpellRange = [...Array(7).keys()].slice(spell.level);
          }
        )
      }
    )
  }


  /**
   * Converts the SpellResponseResults type that the autocomplete values
   * are stored as into the spell names that they show up as
   * @param selectedValue current selected spell value
   * @returns spell name or empty string
   */
  displaySpellAutocompleteValue(selectedValue: SpellResponseResults): string {
    return selectedValue && selectedValue.name ? selectedValue.name : '';
  }

  setGroupedSpellList() {
    let spellsGroups: Observable<SpellResponseResults[]>[] = [];
    for(let i = 0; i <= 6; i++) {
      spellsGroups.push(this.spellsService.getAllSpellsOfLevel(i).pipe(
        map((response) => response.results)
      ))
    }
    this.filteredGroupSpellList = this.attackRollsForm.get('spell')!.valueChanges.pipe(
      startWith(''),
      switchMap(spellSearchInput => {
        let spellString = typeof spellSearchInput === 'string' ? spellSearchInput : spellSearchInput?.name;
        // let spellString = spellSearchInput;
        spellString = spellString?.toLowerCase() || '';
        return forkJoin(spellsGroups).pipe(
          map(spellGroup => 
            spellGroup.map(spellList => 
              spellList.filter(spell =>
                spell.name.toLowerCase().startsWith(spellString || '')
              )
            ).filter(spellList => spellList.length > 0)
          )
        )
      })
    )
  }

  constructor() { }

  ngOnInit(): void {
    this.rawSpellList$ = this.spellsService.getAllSpells();
    this.getSpellList();
    this.addObservableToLevelDropdown();
    this.spellsService.getAllSpellsOfLevel(1).subscribe(
      (spell) => {
        for(let i = 0; i < 14; i++) {
          console.log('this the spell used', spell.results[i])
        }
      }
    )
    this.setGroupedSpellList();
    this.attackRollsForm.valueChanges.subscribe(value => console.log(value));
  }

}
