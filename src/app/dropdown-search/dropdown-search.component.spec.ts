import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSearchComponent } from './dropdown-search.component';
import { DropdownItem } from '../dropdown';

describe('DropdownSearchComponent', () => {
  let component: DropdownSearchComponent;
  let fixture: ComponentFixture<DropdownSearchComponent>;
  const demoDropdownList: { [groupName: string]: DropdownItem[] } = {
    'Grass': [
      { label: 'Bulbasaur', value: 'bulbasaur' },
      { label: 'Ivysaur', value: 'ivysaur' },
      { label: 'Venusaur', value: 'venusaur' }
    ],
    'Fire': [
      { label: 'Bulbasaur', value: 'bulbasaur' },
      { label: 'Ivysaur', value: 'ivysaur' },
      { label: 'Venusaur', value: 'venusaur' }
    ],
    'Water': [
      { label: 'Squirtle', value: 'squirtle' },
      { label: 'Wartortle', value: 'wartortle' },
      { label: 'Blastoise', value: 'blastoise' },
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropdownSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show selectValues', () => {
    component.selectValues = demoDropdownList;

    fixture.detectChanges();

  })
});
