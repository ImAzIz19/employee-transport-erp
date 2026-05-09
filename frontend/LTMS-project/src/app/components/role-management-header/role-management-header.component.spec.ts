import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementHeaderComponent } from './role-management-header.component';

describe('RoleManagementHeaderComponent', () => {
  let component: RoleManagementHeaderComponent;
  let fixture: ComponentFixture<RoleManagementHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleManagementHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
