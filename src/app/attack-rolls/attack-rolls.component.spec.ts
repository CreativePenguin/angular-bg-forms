import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackRollsComponent } from './attack-rolls.component';

fdescribe('AttackRollsComponent', () => {
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

  it('should iterate through maps', () => {
    let coolmap = new Map<string, string>([
      ['1', 'one'], ['2', 'two'], ['3', 'three']
    ]);
  })
});
