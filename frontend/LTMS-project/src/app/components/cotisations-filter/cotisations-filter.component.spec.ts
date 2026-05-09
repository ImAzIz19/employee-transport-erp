import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotisationsFilterComponent } from './cotisations-filter.component';

describe('CotisationsFilterComponent', () => {
  let component: CotisationsFilterComponent;
  let fixture: ComponentFixture<CotisationsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotisationsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotisationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
