import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlannificationHeaderComponent } from './gestion-plannification-header.component';

describe('GestionPlannificationHeaderComponent', () => {
  let component: GestionPlannificationHeaderComponent;
  let fixture: ComponentFixture<GestionPlannificationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlannificationHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlannificationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
