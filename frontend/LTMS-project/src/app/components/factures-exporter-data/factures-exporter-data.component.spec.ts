import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturesExporterDataComponent } from './factures-exporter-data.component';

describe('FacturesExporterDataComponent', () => {
  let component: FacturesExporterDataComponent;
  let fixture: ComponentFixture<FacturesExporterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturesExporterDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturesExporterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
