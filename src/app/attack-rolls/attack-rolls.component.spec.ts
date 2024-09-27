import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackRollsComponent } from './attack-rolls.component';

describe('AttackRollsComponent', () => {
  let component: AttackRollsComponent;
  let fixture: ComponentFixture<AttackRollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttackRollsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackRollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
