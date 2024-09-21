import { Component, inject, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-dice-bonus-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ],
  imports: [ReactiveFormsModule, StepperComponent],
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
  
  ngOnInit() {
    this.parentFormGroup.addControl(this.controlKey,
      new FormGroup({
        d4: new FormControl(0),
        d6: new FormControl(0),
        d8: new FormControl(0),
        d10: new FormControl(0),
        d12: new FormControl(0),
      })
    );
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
  }
}
