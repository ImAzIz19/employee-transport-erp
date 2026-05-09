import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificationDetailsComponent } from './planification-details.component';

describe('PlanificationDetailsComponent', () => {
  let component: PlanificationDetailsComponent;
  let fixture: ComponentFixture<PlanificationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
