import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationShiftsHeaderComponent } from './administration-shifts-header.component';

describe('AdministrationShiftsHeaderComponent', () => {
  let component: AdministrationShiftsHeaderComponent;
  let fixture: ComponentFixture<AdministrationShiftsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrationShiftsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationShiftsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
