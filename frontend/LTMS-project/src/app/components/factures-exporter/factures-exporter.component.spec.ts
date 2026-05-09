import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturesExporterComponent } from './factures-exporter.component';

describe('FacturesExporterComponent', () => {
  let component: FacturesExporterComponent;
  let fixture: ComponentFixture<FacturesExporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturesExporterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturesExporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
