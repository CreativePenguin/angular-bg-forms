import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from "../stepper/stepper.component";
import { DiceSet, DiceSetI, Advantage } from '../../diceset';
import { DiceCalculationsService } from '../dice-calculations.service';
import { DiceBonusFormComponent } from '../dice-bonus-form/dice-bonus-form.component';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatButtonToggleModule } from '@angular/material/button-toggle'

@Component({
  selector: 'app-skill-check',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, 
    StepperComponent, DiceBonusFormComponent,
    MatButtonToggleModule
  ],
  templateUrl: './skill-check.component.html',
  styleUrl: './skill-check.component.scss'
})
export class SkillCheckComponent {
  diceCalcService: DiceCalculationsService = inject(DiceCalculationsService);
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
    advantage: new FormControl(Advantage.none),
    attempts: new FormControl<number>(1, [
      Validators.required,
      Validators.min(0)
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
  advantageOptions = [
    {id: 1, name: 'None', value: Advantage.none},
    {id: 2, name: 'Advantage', value: Advantage.advantage},
    {id: 3, name: 'Disadvantage', value: Advantage.disadvantage},
  ];

  generateDiceSet(): DiceSetI {
    let dieDict = JSON.parse(
      JSON.stringify(this.skillCheckForm.value))['dieBonuses'];
    // previous line converts diebonuses form group into dict,
    // this allows easy construction of new DiceSet once other parameters are set
    dieDict['d20'] = 1;
    dieDict['modifier'] = this.skillCheckForm.value.skillModifier ?? 0;
    dieDict['target'] = this.skillCheckForm.value.targetDC ?? 0;
    return new DiceSet(dieDict);
  }
  skillCheckSubmit() {
    let diceset = this.generateDiceSet();
    let skillCheckSuccessChance = this.diceCalcService.skillCheckCalc(diceset);
    let successElement = document.getElementById('success-chance');
    let targetDCElement = document.getElementById('target-dc-value');
    console.log(this.skillCheckForm.value);
    if(successElement !== null) {
      successElement.innerHTML = (skillCheckSuccessChance).toString();
    }
    if(targetDCElement !== null) {
      targetDCElement.innerHTML = diceset.target.toString();
    }
  }
  constructor() {}
}
