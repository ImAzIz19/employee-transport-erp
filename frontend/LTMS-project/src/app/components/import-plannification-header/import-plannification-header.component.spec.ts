import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPlannificationHeaderComponent } from './import-plannification-header.component';

describe('ImportPlannificationHeaderComponent', () => {
  let component: ImportPlannificationHeaderComponent;
  let fixture: ComponentFixture<ImportPlannificationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportPlannificationHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportPlannificationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
