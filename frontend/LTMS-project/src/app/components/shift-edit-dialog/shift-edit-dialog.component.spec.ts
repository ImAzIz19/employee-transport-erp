import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEditDialogComponent } from './shift-edit-dialog.component';

describe('ShiftEditDialogComponent', () => {
  let component: ShiftEditDialogComponent;
  let fixture: ComponentFixture<ShiftEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
