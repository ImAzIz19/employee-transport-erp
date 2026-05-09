import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleDTO } from '../../interface/role/role';
import { RoleModifyDTO } from '../../interface/role/roleModifyDTO';
import { User } from '../../interface/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserManagerServer {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // Role Management
  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.apiUrl}/roles/get-all`);
  }

  createRole(roleData: RoleModifyDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(`${this.apiUrl}/roles/create`, roleData);
  }

  updateRole(roleId: number, roleData: RoleModifyDTO): Observable<RoleDTO> {
    return this.http.put<RoleDTO>(`${this.apiUrl}/roles/update/${roleId}`, roleData);
  }

  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/delete/${roleId}`);
  }

  // User Management
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData);
  }

  // Permission Management (from your first code snippet)
  getAllPermissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/permissions/get-all`);
  }
}