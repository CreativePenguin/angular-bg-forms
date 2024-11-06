import { Component, inject, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StepperComponent } from '../stepper/stepper.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dice-bonus-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ],
  imports: [ReactiveFormsModule, StepperComponent, MatCardModule],
  templateUrl: './dice-bonus-form.component.html',
  styleUrl: './dice-bonus-form.component.scss'
})
export class DiceBonusFormComponent {
  parentContainer = inject(ControlContainer);
  @Input({required: true}) controlKey = '';
  @Input() label = 'Bonus Dice';

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  public get d4(): FormControl {
    return this.parentFormGroup.get(this.controlKey)?.get('d4') as FormControl
  }

  public set d4(diceNum: number) {
    this.parentFormGroup.get(this.controlKey)?.get('d4')?.setValue(diceNum);
  }

  public get d6(): FormControl {
    return this.parentFormGroup.get(this.controlKey)?.get('d6') as FormControl
  }

  public set d6(diceNum: number) {
    this.parentFormGroup.get(this.controlKey)?.get('d6')?.setValue(diceNum);
  }

  public get d8(): FormControl {
    return this.parentFormGroup.get(this.controlKey)?.get('d8') as FormControl
  }

  public set d8(diceNum: number) {
    this.parentFormGroup.get(this.controlKey)?.get('d8')?.setValue(diceNum);
  }
  
  public get d10(): FormControl {
    return this.parentFormGroup.get(this.controlKey)?.get('d10') as FormControl
  }

  public set d10(diceNum: number) {
    this.parentFormGroup.get(this.controlKey)?.get('d10')?.setValue(diceNum);
  }
  
  public get d12(): FormControl {
    return this.parentFormGroup.get(this.controlKey)?.get('d12') as FormControl
  }

  public set d12(diceNum: number) {
    this.parentFormGroup.get(this.controlKey)?.get('d12')?.setValue(diceNum);
  }

  ngOnInit() {
    this.parentFormGroup.addControl(this.controlKey,
      new FormGroup({
        d4: new FormControl(0),
        d6: new FormControl(0),
        d8: new FormControl(0),
        d10: new FormControl(0),
        d12: new FormControl(0),
        modifier: new FormControl(0),
      })
    );
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
  }
}
