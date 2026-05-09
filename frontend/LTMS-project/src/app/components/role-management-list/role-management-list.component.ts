import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface RolePermission {
  id: number;
  transaction: string;
  description: string;
  assigned: boolean;
  action?: string;
}

@Component({
  selector: 'app-role-management-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './role-management-list.component.html',
  styleUrls: ['./role-management-list.component.css']
})
export class RoleManagementListComponent implements OnInit {
  
  @Input() dataSource: RolePermission[] = [];
  ngOnInit(): void {
console.log(this.dataSource)  }
  displayedColumns: string[] = ['transaction', 'description', 'assigned'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;

  get paginatedData(): RolePermission[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.dataSource.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onAssignmentChange(permission: RolePermission): void {
    permission.assigned = !permission.assigned;
  }

  trackByFn(index: number, item: RolePermission): number {
    return item.id;
  }
}