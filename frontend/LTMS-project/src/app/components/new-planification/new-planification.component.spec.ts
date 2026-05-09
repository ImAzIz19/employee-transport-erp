import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlanificationComponent } from './new-planification.component';

describe('NewPlanificationComponent', () => {
  let component: NewPlanificationComponent;
  let fixture: ComponentFixture<NewPlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlanificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
