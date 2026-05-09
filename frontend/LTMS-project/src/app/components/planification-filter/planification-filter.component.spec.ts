import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificationFilterComponent } from './planification-filter.component';

describe('PlanificationFilterComponent', () => {
  let component: PlanificationFilterComponent;
  let fixture: ComponentFixture<PlanificationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificationFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
