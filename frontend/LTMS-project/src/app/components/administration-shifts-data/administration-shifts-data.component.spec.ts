import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationShiftsDataComponent } from './administration-shifts-data.component';

describe('AdministrationShiftsDataComponent', () => {
  let component: AdministrationShiftsDataComponent;
  let fixture: ComponentFixture<AdministrationShiftsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrationShiftsDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationShiftsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
