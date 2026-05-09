import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExnorImportComponent } from './exnor-import.component';

describe('ExnorImportComponent', () => {
  let component: ExnorImportComponent;
  let fixture: ComponentFixture<ExnorImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExnorImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExnorImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
