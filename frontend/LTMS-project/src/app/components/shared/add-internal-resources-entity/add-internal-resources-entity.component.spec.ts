import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternalResourcesEntityComponent } from './add-internal-resources-entity.component';

describe('AddInternalResourcesEntityComponent', () => {
  let component: AddInternalResourcesEntityComponent;
  let fixture: ComponentFixture<AddInternalResourcesEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInternalResourcesEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInternalResourcesEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
