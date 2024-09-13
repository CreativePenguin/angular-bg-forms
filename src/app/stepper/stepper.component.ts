import { Component, forwardRef } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StepperComponent),
      multi: true,
    }
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  value = 0;
  onChange(value: number) {
    this.value = value;
  }
  onTouch() {}
  increment() {
    this.value = Math.floor(this.value + 1);
  }
  decrement() {
    if (this.value >= 1) {
      this.value = this.value -= 1;
    } else if (this.value < 1) {
      this.value = 0;
    }
  }
  writeValue(value: string) {
    this.value = Number.isNaN(Number(value)) ? 0 : Number(value);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean) {}
}
