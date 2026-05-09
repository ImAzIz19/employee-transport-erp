import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalResourcesComponent } from './internal-resources.component';

describe('InternalResourcesComponent', () => {
  let component: InternalResourcesComponent;
  let fixture: ComponentFixture<InternalResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
