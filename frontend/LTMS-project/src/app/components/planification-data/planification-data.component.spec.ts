import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificationDataComponent } from './planification-data.component';

describe('PlanificationDataComponent', () => {
  let component: PlanificationDataComponent;
  let fixture: ComponentFixture<PlanificationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificationDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
