import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SpellsService } from '../spells.service';
import { Observable } from 'rxjs';
import { SpellResponse } from '../spell';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectSearchModule } from 'mat-select-search';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-attack-rolls',
  standalone: true,
  imports: [
    CommonModule, MatSelectSearchModule, MatInputModule, ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './attack-rolls.component.html',
  styleUrl: './attack-rolls.component.scss'
})
export class AttackRollsComponent implements OnInit{
  spellsService: SpellsService = inject(SpellsService);
  rawSpellList$!: Observable<SpellResponse>;
  attackRollsForm = new FormGroup({
    spell: new FormControl()
  })
  spellsOfEachLevel$!: {[ spellLevel: string]: Observable<SpellResponse>};

  constructor() { }

  ngOnInit(): void {
    this.rawSpellList$ = this.spellsService.getAllSpells();
    this.spellsService.getSpell(
      '/api/spells/flame-strike').subscribe((resp) => console.log(resp));
    for(let i = 0; i <= 6; i++) {
      this.spellsOfEachLevel$[`level ${i}`] = this.spellsService.getAllSpellsOfLevel(i);
    }
  }

}
