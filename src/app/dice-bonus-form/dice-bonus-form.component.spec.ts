import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceBonusFormComponent } from './dice-bonus-form.component';

describe('DiceBonusFormComponent', () => {
  let component: DiceBonusFormComponent;
  let fixture: ComponentFixture<DiceBonusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiceBonusFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiceBonusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
