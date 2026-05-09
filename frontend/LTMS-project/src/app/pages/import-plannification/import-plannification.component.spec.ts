import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPlannificationComponent } from './import-plannification.component';

describe('ImportPlannificationComponent', () => {
  let component: ImportPlannificationComponent;
  let fixture: ComponentFixture<ImportPlannificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportPlannificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportPlannificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
