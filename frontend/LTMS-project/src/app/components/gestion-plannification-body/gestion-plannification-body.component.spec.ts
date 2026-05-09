import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlannificationBodyComponent } from './gestion-plannification-body.component';

describe('GestionPlannificationBodyComponent', () => {
  let component: GestionPlannificationBodyComponent;
  let fixture: ComponentFixture<GestionPlannificationBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlannificationBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlannificationBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
