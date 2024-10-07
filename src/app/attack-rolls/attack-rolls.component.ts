import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SpellsService } from '../spells.service';
import { Observable } from 'rxjs';
import { Spell, SpellResponse, SpellResponseResults } from '../spell';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DropdownSearchComponent } from "../dropdown-search/dropdown-search.component";
import { DropdownItem } from '../dropdown';

@Component({
  selector: 'app-attack-rolls',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, ReactiveFormsModule,
    MatSelectModule,
    DropdownSearchComponent
],
  templateUrl: './attack-rolls.component.html',
  styleUrl: './attack-rolls.component.scss'
})
export class AttackRollsComponent implements OnInit{
  spellsService: SpellsService = inject(SpellsService);
  rawSpellList$!: Observable<SpellResponse>;
  attackRollsForm = new FormGroup({
    spell: new FormControl(''),
    spellLevel: new FormControl(1)
  })
  currentSpellRange: number[] = new Array(6);
  spellsOfEachLevel$: {[ spellLevel: string]: Observable<SpellResponse>} = {};
  // spellsOfEachLevel$!: Map<string,Observable<SpellResponse>>;
  demoDropdownList: {[groupName: string]: DropdownItem[]} = {
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


  constructor() { }

  ngOnInit(): void {
    this.rawSpellList$ = this.spellsService.getAllSpells();
    this.spellsService.getSpell(
      '/api/spells/flame-strike').subscribe((resp) => console.log(resp));
    for(let i = 0; i <= 6; i++) {
      this.spellsOfEachLevel$[`level ${i}`] = this.spellsService.getAllSpellsOfLevel(i);
      // this.spellsOfEachLevel$.set(`level ${i}`, this.spellsService.getAllSpellsOfLevel(i));
    }
    this.attackRollsForm.get('spell')?.valueChanges.subscribe(
      (selectedValue) => {
        console.log('found change to spell', selectedValue);
        this.spellsService.getSpell(selectedValue || '').subscribe(
          (spell) => {
            if(spell.level == 0) this.currentSpellRange = [0];
            else this.currentSpellRange = [...Array(7).keys()].slice(spell.level);
          }
        )
      }
    )
  }

}
