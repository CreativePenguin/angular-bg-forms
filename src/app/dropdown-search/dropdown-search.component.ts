import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { DropdownItem } from '../dropdown';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-search',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSearchComponent),
      multi: true
    }
  ],
  templateUrl: './dropdown-search.component.html',
  styleUrl: './dropdown-search.component.scss'
})
export class DropdownSearchComponent implements OnInit, ControlValueAccessor {
  @Input() selectValues!: {[groupName: string]: DropdownItem[]};
  @Input() style?: string;
  @Input() class?: string;

  @Output() selectedValueEvent = new EventEmitter<DropdownItem>();

  currentSelectValues!: {[groupName: string]: DropdownItem[]};
  public value: string = "";
  public changed?: (value: string) => void;
  public touched?: () => void;
  public isDisabled = false;

  constructor() { }

  ngOnInit(): void {
    for(let groupName in this.selectValues) {
      for(let spell of this.selectValues[groupName]) {
        this.currentSelectValues[groupName].push(spell);
      }
    }
  }
  writeValue(obj: any): void {
    this.value = obj;
    console.log('write value called');
  }
  registerOnChange(fn: any): void {
    this.changed = fn;
    console.log('register on change called');
  }
  registerOnTouched(fn: any): void {
    this.touched = fn;
    console.log('registerOnTouched called');
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    console.log('setDisabledState called');
  }

  selectValueChange() {
    this.selectedValueEvent.emit();
  }

  onKey(event: any) {
    this.currentSelectValues = this.filterSpellResponse(event.target.value);
  }

  filterSpellResponse(searchVal: string): {[groupName: string]: DropdownItem[]} {
    searchVal = searchVal.toLowerCase();
    let filteredValues: { [groupName: string]: DropdownItem[]} = {};
    for(let level in this.selectValues) {
      let filteredSpellList = this.selectValues[level].filter(
        (option) => option.label.toLowerCase().includes(searchVal)
      );
      if(filteredSpellList.length > 0) {
        filteredValues[level] = filteredSpellList;
      }
    }
    return filteredValues;
  }

}
