import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Vehicle } from '../../interface/vehicle/vehicle';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
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

  getVehicles(): Observable<Vehicle[]> {
    if (!this.checkPermission('vehicle:read')) {
      return of([]);
    }
    return this.http.get<Vehicle[]>(`${environment.apiUrl}/api/vehicles/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching vehicles:', err);
        return throwError(() => err);
      })
    );
  }

  getVehicleById(id: number): Observable<Vehicle | null> {
    if (!this.checkPermission('vehicle:read')) {
      console.warn(`Cannot fetch vehicle with id ${id}: missing vehicle:read permission`);
      return of(null);
    }
    return this.http.get<Vehicle>(`${environment.apiUrl}/api/vehicles/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching vehicle with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deleteVehicle(id: number): Observable<void> {
    if (!this.checkPermission('vehicle:delete')) {
      console.warn(`Cannot delete vehicle with id ${id}: missing vehicle:delete permission`);
      return throwError(() => new Error('Missing permission: vehicle:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/vehicles/delete/${id}`).pipe(
      catchError((err) => {
        console.error(`Error deleting vehicle with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    if (!this.checkPermission('vehicle:create')) {
      console.warn('Cannot add vehicle: missing vehicle:create permission');
      return throwError(() => new Error('Missing permission: vehicle:create'));
    }
    return this.http
      .post<Vehicle>(`${environment.apiUrl}/api/vehicles/create`, vehicle, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((response) => {
          console.log('Vehicle added successfully:', response);
          this.dataService.notifyDataChanged("add");
        }),
        catchError((err) => {
          console.error('Error adding vehicle:', err);
          return throwError(() => err);
        })
      );
  }

  updateVehicle(id: number, updatedVehicle: Partial<Vehicle>): Observable<Vehicle> {
    if (!this.checkPermission('vehicle:update')) {
      console.warn(`Cannot update vehicle with id ${id}: missing vehicle:update permission`);
      return throwError(() => new Error('Missing permission: vehicle:update'));
    }
    return this.http
      .put<Vehicle>(`${environment.apiUrl}/api/vehicles/modify/${id}`, updatedVehicle, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap(() => this.dataService.notifyDataChanged("update")),
        catchError((err) => {
          console.error(`Error updating vehicle with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  activateVehicle(id: number): Observable<Vehicle> {
    if (!this.checkPermission('vehicle:status')) {
      console.warn(`Cannot activate vehicle with id ${id}: missing vehicle:status permission`);
      return throwError(() => new Error('Missing permission: vehicle:status'));
    }
    return this.http
      .put<Vehicle>(`${environment.apiUrl}/api/vehicles/activate/${id}`, {}, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.error(`Error activating vehicle with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  deactivateVehicle(id: number): Observable<Vehicle> {
    if (!this.checkPermission('vehicle:status')) {
      console.warn(`Cannot deactivate vehicle with id ${id}: missing vehicle:status permission`);
      return throwError(() => new Error('Missing permission: vehicle:status'));
    }
    return this.http
      .put<Vehicle>(`${environment.apiUrl}/api/vehicles/deactivate/${id}`, {}, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.error(`Error deactivating vehicle with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  exportVehiclesToExcel(): Observable<Blob> {
    if (!this.checkPermission('vehicle:export')) {
      console.warn('Cannot export vehicles: missing vehicle:export permission');
      return throwError(() => new Error('Missing permission: vehicle:export'));
    }
    return this.http
      .get(`${environment.apiUrl}/api/vehicles/export/excel`, {
        responseType: 'blob',
        headers: new HttpHeaders({ Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      })
      .pipe(
        catchError((err) => {
          console.error('Error exporting vehicles to Excel:', err);
          return throwError(() => err);
        })
      );
  }
}