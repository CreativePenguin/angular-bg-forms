import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

/**
 * https://v5.material.angular.io/guide/creating-a-custom-form-field-control
 * guide here in case I want to change my mind and just make one using angular
 * https://www.youtube.com/watch?v=xTcJQaWiJ2c&list=PLw5h0DiJ-9PDF6TTr0J7HmKK_7t6XTPuN <- this guide is used to create this form control
 * This is a custom number input that has plus and minus signs on ths sides to modify the dice value
 */
@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StepperComponent),
      multi: true,
    }
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent implements ControlValueAccessor {
  value: number | null = 0;
  onChange(value: number | null) {
    this.value = value;
  }
  onTouch() {}
  increment() {
    this.updateValue(this.value !== null ? this.value + 1 : 1);
  }
  decrement() {
    if (this.value ?? 0 >= 1) {
      this.updateValue(this.value != null ? this.value - 1 : 0);
    } else if (this.value ?? 1 < 1) {
      this.updateValue(0);
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
  updateValue(newValue: number | null): void {
    if (newValue !== this.value) {
      this.value = newValue;
      this.onChange(newValue);
      this.onTouch();
    }
  }
  setDisabledState?(isDisabled: boolean) {}
}
