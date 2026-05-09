import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotisationsComponent } from './cotisations.component';

describe('CotisationsComponent', () => {
  let component: CotisationsComponent;
  let fixture: ComponentFixture<CotisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotisationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
