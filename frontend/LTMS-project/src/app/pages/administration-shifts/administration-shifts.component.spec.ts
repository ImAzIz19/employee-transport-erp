import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationShiftsComponent } from './administration-shifts.component';

describe('AdministrationShiftsComponent', () => {
  let component: AdministrationShiftsComponent;
  let fixture: ComponentFixture<AdministrationShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrationShiftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
