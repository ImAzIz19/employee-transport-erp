import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlannificationDataComponent } from './gestion-plannification-data.component';

describe('GestionPlannificationDataComponent', () => {
  let component: GestionPlannificationDataComponent;
  let fixture: ComponentFixture<GestionPlannificationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlannificationDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlannificationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
