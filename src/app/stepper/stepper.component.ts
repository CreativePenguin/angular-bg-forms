import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

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
