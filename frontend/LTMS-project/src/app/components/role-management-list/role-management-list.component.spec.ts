import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementListComponent } from './role-management-list.component';

describe('RoleManagementListComponent', () => {
  let component: RoleManagementListComponent;
  let fixture: ComponentFixture<RoleManagementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleManagementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
