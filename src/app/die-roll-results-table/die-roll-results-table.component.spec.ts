import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieRollResultsTableComponent } from './die-roll-results-table.component';

describe('DieRollResultsTableComponent', () => {
  let component: DieRollResultsTableComponent;
  let fixture: ComponentFixture<DieRollResultsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieRollResultsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieRollResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
