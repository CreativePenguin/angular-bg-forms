import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild, viewChild, viewChildren, ViewContainerRef } from '@angular/core';
import { SpellsService } from '../spells.service';
import { filter, forkJoin, map, merge, Observable, of, startWith, switchMap, toArray } from 'rxjs';
import { Spell, SpellI, SpellGroup, SpellGroupIResponse, SpellResponse, SpellResponseResults } from '../spell';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DropdownSearchComponent } from "../dropdown-search/dropdown-search.component";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DiceBonusFormComponent } from '../dice-bonus-form/dice-bonus-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-attack-rolls',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, ReactiveFormsModule,
    MatSelectModule, MatAutocompleteModule, MatCardModule,
    DropdownSearchComponent, DiceBonusFormComponent, MatButtonModule
],
  templateUrl: './attack-rolls.component.html',
  styleUrl: './attack-rolls.component.scss'
})
export class AttackRollsComponent implements OnInit{
  spellsService: SpellsService = inject(SpellsService);
  rawSpellList$!: Observable<SpellResponse>;
  currentSpellRange: number[] = new Array(6);
  selectedSpell: SpellI | undefined = undefined;
  attackRollsForm = new FormGroup({
    spell: new FormControl<string | Spell>(''),
    spellLevel: new FormControl<number>(this.selectedSpell?.level || 1),
    testAutocomplete: new FormControl<string | Spell>(''),
    hardCodedAutocomplete: new FormControl('')
  });
  filteredGroupSpellList!: Observable<SpellResponseResults[][]>;
  groupedSpellList!: Observable<SpellGroupIResponse[]>;
  @ViewChild('dieForm') diceBonusComponent!: DiceBonusFormComponent;
  vcr = viewChild('tableContainer');

  /**
   * initialize observable to autocomplete to change form values based on selected spell
   * 1. use spell value to change currentSpellRange array (this changes values shown in level selector)
   * 2. use spell value to change diceBonusComponent dice values
   */
  addObservableToAutocomplete() {
    this.attackRollsForm.get('spell')!.valueChanges.subscribe(
      (selectedValue) => {
        console.log('found change to spell', selectedValue);
        const selectedValueAsString = typeof selectedValue === 'string' ? '' : selectedValue?.url;
        this.spellsService.getSpell(selectedValueAsString || '').subscribe(
          (spell) => {
            if(spell.level == 0) this.currentSpellRange = [0];
            else this.currentSpellRange = [...Array(7).keys()].slice(spell.level);
            this.selectedSpell = spell;

            let minLevel = this.currentSpellRange[0];
            this.diceBonusComponent.d4 = spell.damage[minLevel].d4 || 0;
            this.diceBonusComponent.d6 = spell.damage[minLevel].d6 || 0;
            this.diceBonusComponent.d8 = spell.damage[minLevel].d8 || 0;
            this.diceBonusComponent.d10 = spell.damage[minLevel].d10 || 0;
            this.diceBonusComponent.d12 = spell.damage[minLevel].d12 || 0;
          }
        )
      }
    )
  }

  addObservableToLevelDropdown() {
    this.attackRollsForm.get('spellLevel')!.valueChanges.subscribe(
      (levelNum) => {
        console.log('spell level changed');
        levelNum = levelNum ?? this.currentSpellRange[0];
        this.diceBonusComponent.d4 = this.selectedSpell?.damage[levelNum].d4 || 0;
        this.diceBonusComponent.d6 = this.selectedSpell?.damage[levelNum].d6 || 0;
        this.diceBonusComponent.d8 = this.selectedSpell?.damage[levelNum].d8 || 0;
        this.diceBonusComponent.d10 = this.selectedSpell?.damage[levelNum].d10 || 0;
        this.diceBonusComponent.d12 = this.selectedSpell?.damage[levelNum].d12 || 0;
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
    this.addObservableToAutocomplete();
    this.addObservableToLevelDropdown();
    this.setGroupedSpellList();
    this.attackRollsForm.valueChanges.subscribe(value => console.log(value));
  }

}
