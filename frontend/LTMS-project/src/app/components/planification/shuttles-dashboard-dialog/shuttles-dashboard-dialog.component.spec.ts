import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttlesDashboardDialogComponent } from './shuttles-dashboard-dialog.component';

describe('ShuttlesDashboardDialogComponent', () => {
  let component: ShuttlesDashboardDialogComponent;
  let fixture: ComponentFixture<ShuttlesDashboardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShuttlesDashboardDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShuttlesDashboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
