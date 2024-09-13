import { Component, forwardRef, Inject, Injector, OnInit } from '@angular/core';
import { ControlValueAccessor,  FormControl,  FormControlName,  FormGroupDirective,  NG_VALUE_ACCESSOR,  NgControl,  ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  // selector: 'input[type="incrementer"]',
  selector: 'app-incrementer',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputIncrementerComponent)
    }
  ],
  imports: [ReactiveFormsModule],
  templateUrl: './input-incrementer.component.html',
  styleUrl: './input-incrementer.component.css'
})
export class InputIncrementerComponent<T> implements ControlValueAccessor, OnInit {
  control!: FormControl;
  isRequired = false;
  private _isDisabled = false;
  private _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  constructor(@Inject(Injector) private injector: Injector) {}

  ngOnInit(): void {
    this.control = this.injector.get(FormControl);
    this.isRequired = this.control.hasValidator(Validators.required);
  }

  // setFormControl() {
  //   try {
  //     const formControl = this.injector.get(NgControl);
  //     switch(formControl.constructor) {
  //       case FormControl:
  //         this.control = this.injector
  //           .get(FormGroupDirective)
  //           .getControl(formControl as FormControlName);
  //       break;
  //       default:
  //         this.control = (formControl as FormGroupDirective)
  //           .form as FormControl;
  //         break;
  //     }
  //   } catch(err) {

  //   }
  // }

  writeValue(obj: T): void {
    this.control
      ? this.control.setValue(obj)
      : this.control = new FormControl(obj);
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  increment() {
    
  }
  decrement() {}
}
