import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningDownloadDialogComponent } from './planning-download-dialog.component';

describe('PlanningDownloadDialogComponent', () => {
  let component: PlanningDownloadDialogComponent;
  let fixture: ComponentFixture<PlanningDownloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningDownloadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
