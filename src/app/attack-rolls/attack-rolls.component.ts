import { CommonModule } from '@angular/common';
import { Component, ComponentRef, inject, OnInit, ViewChild, viewChild, viewChildren, ViewContainerRef } from '@angular/core';
import { SpellsService } from '../spells.service';
import { forkJoin, map, Observable, startWith, switchMap } from 'rxjs';
import { Spell, SpellI, SpellGroupIResponse, SpellResponse, SpellResponseResults } from '../spell';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DiceBonusFormComponent } from '../dice-bonus-form/dice-bonus-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DieRollResultsTableComponent } from '../die-roll-results-table/die-roll-results-table.component';
import { DiceResults, DiceSet, DiceSetI } from '../diceset';
import { DiceCalculationsService } from '../dice-calculations.service';

@Component({
  selector: 'app-attack-rolls',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, ReactiveFormsModule,
    MatSelectModule, MatAutocompleteModule, MatCardModule,
    DiceBonusFormComponent, MatButtonModule
],
  templateUrl: './attack-rolls.component.html',
  styleUrl: './attack-rolls.component.scss'
})
export class AttackRollsComponent implements OnInit{
  spellsService: SpellsService = inject(SpellsService);
  diceCalcService: DiceCalculationsService = inject(DiceCalculationsService);
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
  vcr = viewChild('tableContainer', {read: ViewContainerRef});
  #tableRef!: ComponentRef<DieRollResultsTableComponent> | undefined;

  /**
   * initialize observable to autocomplete to change form values based on selected spell
   * 1. use spell value to change currentSpellRange array (this changes values shown in level selector)
   * 2. use spell value to change diceBonusComponent dice values
   */
  addObservableToAutocomplete() {
    this.attackRollsForm.get('spell')!.valueChanges.subscribe(
      (selectedValue) => {
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
        levelNum = levelNum ?? this.currentSpellRange[0];
        this.diceBonusComponent.d4 = this.selectedSpell?.damage[levelNum].d4 || 0;
        this.diceBonusComponent.d6 = this.selectedSpell?.damage[levelNum].d6 || 0;
        this.diceBonusComponent.d8 = this.selectedSpell?.damage[levelNum].d8 || 0;
        this.diceBonusComponent.d10 = this.selectedSpell?.damage[levelNum].d10 || 0;
        this.diceBonusComponent.d12 = this.selectedSpell?.damage[levelNum].d12 || 0;
      }
    )
  }

  addObservableToGetDiceCalc() {
    this.attackRollsForm.valueChanges.subscribe(
      
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

  generateTable(tableInput: DiceResults[] | undefined) {
    this.vcr()?.clear();
    this.#tableRef = this.vcr()?.createComponent(DieRollResultsTableComponent);
    if(tableInput) {
      this.#tableRef?.setInput('diceResults', tableInput);
    }
  }

  generateDiceSet(): DiceSetI {
    let dieDict: DiceSetI = new DiceSet(JSON.parse(
      JSON.stringify(this.attackRollsForm.value))['dieBonuses']);
    console.log('submit received (attack-rolls)', dieDict);
    return dieDict;
  }

  attackRollsFormSubmit() {
    let diceSet = this.generateDiceSet();
    // console.log('submit', diceSet);
    let minElement = document.getElementById('damage-min');
    let maxElement = document.getElementById('damage-max');
    if(minElement && maxElement) {
      minElement.innerText = this.diceCalcService.minRoll(diceSet).toString();
      maxElement.innerText = this.diceCalcService.maxRoll(diceSet).toString();
    }

    let diceCalcResults = this.diceCalcService.diceCalcResults(diceSet);
    this.generateTable(diceCalcResults);
  }

  constructor() { }

  ngOnInit(): void {
    this.rawSpellList$ = this.spellsService.getAllSpells();
    this.addObservableToAutocomplete();
    this.addObservableToLevelDropdown();
    this.setGroupedSpellList();
    this.generateTable(undefined);
    this.attackRollsForm.valueChanges.subscribe(value => 
      console.log('attack rolls form', value));
  }

}
