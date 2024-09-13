import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCheckComponent } from './skill-check.component';

describe('SkillCheckComponent', () => {
  let component: SkillCheckComponent;
  let fixture: ComponentFixture<SkillCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
