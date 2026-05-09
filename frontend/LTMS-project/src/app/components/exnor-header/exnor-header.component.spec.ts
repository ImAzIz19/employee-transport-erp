import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExnorHeaderComponent } from './exnor-header.component';

describe('ExnorHeaderComponent', () => {
  let component: ExnorHeaderComponent;
  let fixture: ComponentFixture<ExnorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExnorHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExnorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
