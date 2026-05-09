import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationDialogComponentComponent } from './delete-confirmation-dialog-component.component';

describe('DeleteConfirmationDialogComponentComponent', () => {
  let component: DeleteConfirmationDialogComponentComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
