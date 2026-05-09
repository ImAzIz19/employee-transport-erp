import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotisationsHeaderComponent } from './cotisations-header.component';

describe('CotisationsHeaderComponent', () => {
  let component: CotisationsHeaderComponent;
  let fixture: ComponentFixture<CotisationsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotisationsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotisationsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
