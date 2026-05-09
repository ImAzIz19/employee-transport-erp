import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSelectorComponent } from './station-selector.component';

describe('StationSelectorComponent', () => {
  let component: StationSelectorComponent;
  let fixture: ComponentFixture<StationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
