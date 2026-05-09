import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueRecapDialogComponent } from './historique-recap-dialog.component';

describe('HistoriqueRecapDialogComponent', () => {
  let component: HistoriqueRecapDialogComponent;
  let fixture: ComponentFixture<HistoriqueRecapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueRecapDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueRecapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
