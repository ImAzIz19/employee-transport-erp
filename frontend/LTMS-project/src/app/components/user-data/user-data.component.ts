import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserFilterComponent } from "../user-filter/user-filter.component";
import { UserManagerServer } from '../../services/userManger/user-manger.service';
import { User } from '../../interface/user/user';
import { RoleDTO } from '../../interface/role/role';

@Component({
  selector: 'app-user-data',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatSortModule,
    TranslateModule,
    UserFilterComponent
  ],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
  standalone: true
})
export class UserDataComponent {
  @ViewChild(MatSort) sort!: MatSort;
  isLoading = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  filteredData: User[] = [];
  displayedColumns: string[] = ['loginName', 'firstName', 'lastName', 'email', 'roles', 'orgUnit', 'action'];
  dataSource = new MatTableDataSource<User>([]);
  users: User[] = [];

  constructor(
    private userManagerServer: UserManagerServer,
    private router: Router
  ) {
  }

  ngOnInit() {
  this.loadData();
}
  loadData() {
    this.isLoading = true;
    this.userManagerServer.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.dataSource.data = users;
        this.filteredData = [...users];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
        // Optionally show error message to user
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName': return this.compare(a.firstName, b.firstName, isAsc);
        case 'lastName': return this.compare(a.lastName, b.lastName, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: string, b: string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilters(filters: any) {
    const { search, roles, org } = filters;

    this.filteredData = this.users.filter(user => {
      const matchesSearch = !search ||
        (user.firstName + ' ' + user.lastName).toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRoles = !roles || roles.length === 0 ||
        (user.roles && user.roles.some((role: RoleDTO) => roles.includes(role.name)));

      return matchesSearch && matchesRoles;
    });

    this.dataSource.data = this.filteredData;
  }

  editUser(userId: number) {
    this.router.navigate([`/users/edit/${userId}`]);
  }

  // deleteUser(userId: number) {
  //   if (confirm('Are you sure you want to delete this user?')) {
  //     this.isLoading = true;
  //     this.userManagerServer.deleteUser(userId).subscribe({
  //       next: () => {
  //         this.loadData(); // Refresh the table after deletion
  //       },
  //       error: (error) => {
  //         console.error('Error deleting user:', error);
  //         this.isLoading = false;
  //         // Optionally show error message to user
  //       }
  //     });
  //   }
  // }
}