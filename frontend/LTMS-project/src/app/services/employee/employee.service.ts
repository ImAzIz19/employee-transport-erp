import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Employee } from '../../interface/Employee/Employee';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';
import { UploadActionDTO } from '../../interface/UploadAction/UploadAction';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  private checkPermission(permission: string): boolean {
    if (!this.authService.hasPermission(permission)) {
      console.warn(`Missing permission: ${permission}`);
      return false;
    }
    return true;
  }

  getEmployees(): Observable<Employee[]> {
    if (!this.checkPermission('employee:read')) {
      console.warn('Cannot fetch employees: missing employee:read permission');
      return of([]);
    }
    return this.http.get<Employee[]>(`${environment.apiUrl}/api/employees/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching employees:', err);
        return throwError(() => err);
      })
    );
  }

  getEmployeeById(id: number): Observable<Employee | null> {
    if (!this.checkPermission('employee:read')) {
      console.warn(`Cannot fetch employee with id ${id}: missing employee:read permission`);
      return of(null);
    }
    return this.http.get<Employee>(`${environment.apiUrl}/api/employees/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching employee with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deleteEmployee(id: number): Observable<void> {
    if (!this.checkPermission('employee:delete')) {
      console.warn(`Cannot delete employee with id ${id}: missing employee:delete permission`);
      return throwError(() => new Error('Missing permission: employee:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/employees/delete/${id}`).pipe(
      catchError((err) => {
        console.error(`Error deleting employee with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    if (!this.checkPermission('employee:create')) {
      console.warn('Cannot add employee: missing employee:create permission');
      return throwError(() => new Error('Missing permission: employee:create'));
    }
    return this.http.post<Employee>(
      `${environment.apiUrl}/api/employees/create`,
      employee,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap((response) => {
        this.dataService.notifyDataChanged("add");
      }),
      catchError((err) => {
        console.error('Error creating employee:', err);
        return throwError(() => err);
      })
    );
  }

  updateEmployee(id: number, updatedEmployee: Partial<Employee>): Observable<Employee> {
    if (!this.checkPermission('employee:update')) {
      console.warn(`Cannot update employee with id ${id}: missing employee:update permission`);
      return throwError(() => new Error('Missing permission: employee:update'));
    }
    return this.http.put<Employee>(
      `${environment.apiUrl}/api/employees/modify/${id}`,
      updatedEmployee,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap(() => {
        this.dataService.notifyDataChanged("update");
      }),
      catchError((err) => {
        console.error(`Error updating employee with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  activateEmployee(id: number): Observable<Employee> {
    if (!this.checkPermission('employee:status')) {
      console.warn(`Cannot activate employee with id ${id}: missing employee:status permission`);
      return throwError(() => new Error('Missing permission: employee:status'));
    }
    return this.http.put<Employee>(
      `${environment.apiUrl}/api/employees/${id}/activate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error activating employee with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deactivateEmployee(id: number): Observable<Employee> {
    if (!this.checkPermission('employee:status')) {
      console.warn(`Cannot deactivate employee with id ${id}: missing employee:status permission`);
      return throwError(() => new Error('Missing permission: employee:status'));
    }
    return this.http.put<Employee>(
      `${environment.apiUrl}/api/employees/${id}/deactivate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error deactivating employee with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  importEmployees(file: FormData): Observable<any> {
    if (!this.checkPermission('employee:import')) {
      console.warn('Cannot import employees: missing employee:import permission');
      return throwError(() => new Error('Missing permission: employee:import'));
    }
    return this.http.post(`${environment.apiUrl}/import`, file).pipe(
      catchError((err) => {
        console.error('Error importing employees:', err);
        return throwError(() => err);
      })
    );
  }

  downloadEmployeeTemplate(): Observable<Blob> {
    if (!this.checkPermission('employee:import')) {
      const errorMsg = 'Cannot download employee template: missing employee:import permission';
      console.warn(errorMsg);
      return throwError(() => new Error(errorMsg));
    }

    return this.http.get(`${environment.apiUrl}/api/employees/template`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }).pipe(
      catchError((err) => {
        console.error('Error downloading employee template:', err);
        return throwError(() => err);
      })
    );
  }

  uploadFile(file: File): Observable<any> {
    if (!this.checkPermission('employee:import')) {
      console.warn('Cannot upload file: missing employee:import permission');
      return throwError(() => new Error('Missing permission: employee:import'));
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/api/employees/upload`, formData).pipe(
      catchError((err) => {
        console.error('Error uploading file:', err);
        return throwError(() => err);
      })
    );
  }

  getAllUploadActions(): Observable<UploadActionDTO[]> {
    if (!this.checkPermission('employee:read')) {
      console.warn('Cannot fetch upload actions: missing employee:read permission');
      return of([]);
    }
    return this.http.get<UploadActionDTO[]>(`${environment.apiUrl}/api/upload-actions/all`).pipe(
      catchError((err) => {
        console.error('Error fetching upload actions:', err);
        return throwError(() => err);
      })
    );
  }

  exportEmployeesToExcel(): Observable<Blob> {
    if (!this.checkPermission('employee:export')) {
      console.warn('Cannot export employees: missing employee:export permission');
      return throwError(() => new Error('Missing permission: employee:export'));
    }
    return this.http.get(
      `${environment.apiUrl}/api/employees/export/excel`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }
    ).pipe(
      catchError((err) => {
        console.error('Error exporting employees to Excel:', err);
        return throwError(() => err);
      })
    );
  }
}