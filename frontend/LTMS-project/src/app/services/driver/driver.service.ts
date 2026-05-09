import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Driver } from '../../interface/driver/driver';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private checkPermission(permission: string): boolean {
    if (!this.authService.hasPermission(permission)) {
      console.warn(`Missing permission: ${permission}`);
      return false;
    }
    return true;
  }

  getDrivers(): Observable<Driver[]> {
    if (!this.checkPermission('driver:read')) {
      return of([]);
    }
    return this.http.get<Driver[]>(`${environment.apiUrl}/api/drivers/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching drivers:', err);
        return throwError(() => err);
      })
    );
  }

  getDriverById(id: number): Observable<Driver | null> {
    if (!this.checkPermission('driver:read')) {
      console.warn(`Cannot fetch driver with id ${id}: missing driver:read permission`);
      return of(null);
    }
    return this.http.get<Driver>(`${environment.apiUrl}/api/drivers/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching driver with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deleteDriver(id: number): Observable<void> {
    if (!this.checkPermission('driver:delete')) {
      console.warn(`Cannot delete driver with id ${id}: missing driver:delete permission`);
      return throwError(() => new Error('Missing permission: driver:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/drivers/delete/${id}`).pipe(
      catchError((err) => {
        console.error(`Error deleting driver with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addDriver(driver: Driver): Observable<Driver> {
    if (!this.checkPermission('driver:create')) {
      console.warn('Cannot add driver: missing driver:create permission');
      return throwError(() => new Error('Missing permission: driver:create'));
    }
    return this.http
      .post<Driver>(`${environment.apiUrl}/api/drivers/create`, driver, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((response) => {
          console.log('Driver added successfully:', response);
          this.dataService.notifyDataChanged("add");
        }),
        catchError((err) => {
          console.error('Error adding driver:', err);
          return throwError(() => err);
        })
      );
  }

  updateDriver(id: number, updatedDriver: Partial<Driver>): Observable<Driver> {
    if (!this.checkPermission('driver:update')) {
      console.warn(`Cannot update driver with id ${id}: missing driver:update permission`);
      return throwError(() => new Error('Missing permission: driver:update'));
    }
    return this.http
      .put<Driver>(`${environment.apiUrl}/api/drivers/modify/${id}`, updatedDriver, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap(() => this.dataService.notifyDataChanged("update")),
        catchError((err) => {
          console.error(`Error updating driver with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  activateDriver(id: number): Observable<Driver> {
    if (!this.checkPermission('driver:update')) {
      console.warn(`Cannot activate driver with id ${id}: missing driver:update permission`);
      return throwError(() => new Error('Missing permission: driver:update'));
    }
    return this.http
      .put<Driver>(`${environment.apiUrl}/api/drivers/activate/${id}`, {}, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.error(`Error activating driver with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  deactivateDriver(id: number): Observable<Driver> {
    if (!this.checkPermission('driver:update')) {
      console.warn(`Cannot deactivate driver with id ${id}: missing driver:update permission`);
      return throwError(() => new Error('Missing permission: driver:update'));
    }
    return this.http
      .put<Driver>(`${environment.apiUrl}/api/drivers/deactivate/${id}`, {}, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.error(`Error deactivating driver with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  exportDriversToExcel(): Observable<Blob> {
    if (!this.checkPermission('driver:read')) {
      console.warn('Cannot export drivers: missing driver:read permission');
      return throwError(() => new Error('Missing permission: driver:read'));
    }
    return this.http
      .get(`${environment.apiUrl}/api/drivers/export/excel`, {
        responseType: 'blob',
        headers: new HttpHeaders({ Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      })
      .pipe(
        catchError((err) => {
          console.error('Error exporting drivers to Excel:', err);
          return throwError(() => err);
        })
      );
  }
}