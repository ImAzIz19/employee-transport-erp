import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimportComponent } from './simport.component';

describe('SimportComponent', () => {
  let component: SimportComponent;
  let fixture: ComponentFixture<SimportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
