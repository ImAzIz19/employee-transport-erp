import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Station } from '../../interface/station/station';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StationService {

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

  getStations(): Observable<Station[]> {
    if (!this.checkPermission('station:read')) {
      console.warn('Cannot fetch stations: missing station:read permission');
      return of([]);
    }
    return this.http.get<Station[]>(`${environment.apiUrl}/api/station/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching stations:', err);
        return throwError(() => err);
      })
    );
  }

  getStationById(id: number): Observable<Station | null> {
    if (!this.checkPermission('station:read')) {
      console.warn(`Cannot fetch station with id ${id}: missing station:read permission`);
      return of(null);
    }
    return this.http.get<Station>(`${environment.apiUrl}/api/station/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching station with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deleteStation(id: number): Observable<void> {
    if (!this.checkPermission('station:delete')) {
      console.warn(`Cannot delete station with id ${id}: missing station:delete permission`);
      return throwError(() => new Error('Missing permission: station:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/station/delete/${id}`).pipe(
      catchError((err) => {
        console.error(`Error deleting station with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addStation(station: Station): Observable<Station> {
    if (!this.checkPermission('station:create')) {
      console.warn('Cannot add station: missing station:create permission');
      return throwError(() => new Error('Missing permission: station:create'));
    }
    return this.http.post<Station>(
      `${environment.apiUrl}/api/station/create`,
      station,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap((response) => {
        this.dataService.notifyDataChanged("add");
      }),
      catchError((err) => {
        console.error('Error creating station:', err);
        return throwError(() => err);
      })
    );
  }

  updateStation(id: number, updatedStation: Partial<Station>): Observable<Station> {
    if (!this.checkPermission('station:update')) {
      console.warn(`Cannot update station with id ${id}: missing station:update permission`);
      return throwError(() => new Error('Missing permission: station:update'));
    }
    return this.http.put<Station>(
      `${environment.apiUrl}/api/station/modify/${id}`,
      updatedStation,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap(() => {
        this.dataService.notifyDataChanged("update");
      }),
      catchError((err) => {
        console.error(`Error updating station with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  activateStation(id: number): Observable<Station> {
    if (!this.checkPermission('station:status')) {
      console.warn(`Cannot activate station with id ${id}: missing station:status permission`);
      return throwError(() => new Error('Missing permission: station:status'));
    }
    return this.http.put<Station>(
      `${environment.apiUrl}/api/station/${id}/activate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error activating station with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deactivateStation(id: number): Observable<Station> {
    if (!this.checkPermission('station:status')) {
      console.warn(`Cannot deactivate station with id ${id}: missing station:status permission`);
      return throwError(() => new Error('Missing permission: station:status'));
    }
    return this.http.put<Station>(
      `${environment.apiUrl}/api/station/${id}/deactivate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error deactivating station with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  importStations(file: FormData): Observable<any> {
    if (!this.checkPermission('station:import')) {
      console.warn('Cannot import stations: missing station:import permission');
      return throwError(() => new Error('Missing permission: station:import'));
    }
    return this.http.post(`${environment.apiUrl}/import`, file).pipe(
      catchError((err) => {
        console.error('Error importing stations:', err);
        return throwError(() => err);
      })
    );
  }

  downloadStationTemplate(): Observable<Blob> {
    if (!this.checkPermission('station:import')) {
      console.warn('Cannot download station template: missing station:import permission');
      return throwError(() => new Error('Missing permission: station:import'));
    }
    return this.http.get(`${environment.apiUrl}/api/station/template`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }).pipe(
      catchError((err) => {
        console.error('Error downloading planification template:', err);
        return throwError(() => err);
      })
    );
  }

  uploadFile(file: File): Observable<any> {
    if (!this.checkPermission('station:import')) {
      console.warn('Cannot upload file: missing station:import permission');
      return throwError(() => new Error('Missing permission: station:import'));
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/api/station/upload`, formData).pipe(
      catchError((err) => {
        console.error('Error uploading file:', err);
        return throwError(() => err);
      })
    );
  }

  exportStationsToExcel(): Observable<Blob> {
    if (!this.checkPermission('station:export')) {
      console.warn('Cannot export stations: missing station:export permission');
      return throwError(() => new Error('Missing permission: station:export'));
    }
    return this.http.get(
      `${environment.apiUrl}/api/station/export/excel`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }
    ).pipe(
      catchError((err) => {
        console.error('Error exporting stations to Excel:', err);
        return throwError(() => err);
      })
    );
  }
}