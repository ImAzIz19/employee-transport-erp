import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlannificationComponent } from './gestion-plannification.component';

describe('GestionPlannificationComponent', () => {
  let component: GestionPlannificationComponent;
  let fixture: ComponentFixture<GestionPlannificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlannificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlannificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
