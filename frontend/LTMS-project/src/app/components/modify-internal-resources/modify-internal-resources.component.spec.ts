import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyInternalResourcesComponent } from './modify-internal-resources.component';

describe('ModifyInternalResourcesComponent', () => {
  let component: ModifyInternalResourcesComponent;
  let fixture: ComponentFixture<ModifyInternalResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyInternalResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyInternalResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
