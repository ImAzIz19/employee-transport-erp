import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExonorContricutionsComponent } from './exonor-contricutions.component';

describe('ExonorContricutionsComponent', () => {
  let component: ExonorContricutionsComponent;
  let fixture: ComponentFixture<ExonorContricutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExonorContricutionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExonorContricutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
