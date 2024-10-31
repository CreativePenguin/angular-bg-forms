import { CommonModule } from '@angular/common';
import { Component, ComponentRef, inject, OnInit, viewChild, ViewContainerRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from "../stepper/stepper.component";
import { DiceSet, DiceSetI, Advantage, DiceResults } from '../../diceset';
import { DiceCalculationsService } from '../dice-calculations.service';
import { DiceBonusFormComponent } from '../dice-bonus-form/dice-bonus-form.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DieRollResultsTableComponent } from '../die-roll-results-table/die-roll-results-table.component';

@Component({
  selector: 'app-skill-check',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, MatCardModule, MatSelectModule,
    StepperComponent, DiceBonusFormComponent, MatButtonModule,
    MatButtonToggleModule, MatInputModule
  ],
  templateUrl: './skill-check.component.html',
  styleUrl: './skill-check.component.scss'
})
export class SkillCheckComponent implements OnInit {
  diceCalcService: DiceCalculationsService = inject(DiceCalculationsService);
  vcr = viewChild('tableContainer', {read: ViewContainerRef});
  #tableRef!: ComponentRef<DieRollResultsTableComponent> | undefined;
  skillCheckForm = new FormGroup({
    targetDC: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0)
    ]),
    skillModifier: new FormControl(0),
    // dieBonuses: new FormGroup({
    //   ' d4': new FormControl(0),
    //   ' d6': new FormControl(0),
    //   ' d8': new FormControl(0),
    //   'd10': new FormControl(0),
    //   'd12': new FormControl(0),
    // }),
    advantage: new FormControl<Advantage>(Advantage.None),
    attempts: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1)
    ])
  });
  dieBonusForm = new FormGroup({
    ' d4': new FormControl(0),
    ' d6': new FormControl(0),
    ' d8': new FormControl(0),
    'd10': new FormControl(0),
    'd12': new FormControl(0),
  });
  // diceSet!: DiceSet;
  advantageEnum: typeof Advantage = Advantage;
  advantageNone = Advantage.None;
  advantageAdvantage = Advantage.Advantage
  advantageDisadvantage = Advantage.Disadvantage;
  advantageOptions = [
    {id: 1, name: 'None', value: Advantage.None},
    {id: 2, name: 'Advantage', value: Advantage.Advantage},
    {id: 3, name: 'Disadvantage', value: Advantage.Disadvantage},
  ];
  attemptsOptions = [1, 2, 3, 4];

  isAdvantageNone(currentAdvantageValue: Advantage) {
    return currentAdvantageValue === Advantage.None;
  }

  generateDiceSet(): DiceSetI {
    let dieDict = JSON.parse(
      JSON.stringify(this.skillCheckForm.value))['dieBonuses'];
    // previous line converts diebonuses form group into dict,
    // this allows easy construction of new DiceSet once other parameters are set
    dieDict['d20'] = 1;
    dieDict['modifier'] = this.skillCheckForm.value.skillModifier ?? 0;
    dieDict['target'] = this.skillCheckForm.value.targetDC ?? 0;
    dieDict['advantage'] = this.skillCheckForm.value.advantage ?? Advantage.None;
    return new DiceSet(dieDict);
  }

  createTableComponent(tableInput: DiceResults[] | undefined=undefined) {
    this.vcr()?.clear();
    this.#tableRef = this.vcr()?.createComponent(DieRollResultsTableComponent);
    if(tableInput) {
      console.log('table recreated');
      this.#tableRef?.setInput('diceResults', tableInput);
    }
  }

  skillCheckSubmit() {
    let diceset = this.generateDiceSet();
    let skillCheckSuccessChance = this.diceCalcService.skillCheckCalc(diceset);
    let successElement = document.getElementById('success-chance');
    let targetDCElement = document.getElementById('target-dc-value');
    let diceRollResults = this.diceCalcService.diceCalcResults(diceset);
    console.log('skill check submit', this.skillCheckForm.value);
    if(successElement !== null) {
      successElement.innerHTML = (skillCheckSuccessChance).toString();
    }
    if(targetDCElement !== null) {
      targetDCElement.innerHTML = diceset.target.toString();
    }
    this.createTableComponent(diceRollResults);
  }

  ngOnInit(): void {
    this.createTableComponent();
  }

  constructor() {}
}
