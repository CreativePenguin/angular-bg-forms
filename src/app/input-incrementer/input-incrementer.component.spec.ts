import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputIncrementerComponent } from './input-incrementer.component';

describe('InputIncrementerComponent', () => {
  let component: InputIncrementerComponent;
  let fixture: ComponentFixture<InputIncrementerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputIncrementerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputIncrementerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
