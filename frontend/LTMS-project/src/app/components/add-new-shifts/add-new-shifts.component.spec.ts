import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewShiftsComponent } from './add-new-shifts.component';

describe('AddNewShiftsComponent', () => {
  let component: AddNewShiftsComponent;
  let fixture: ComponentFixture<AddNewShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewShiftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
