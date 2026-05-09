import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Agency } from '../../interface/agency/agency';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
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

  getAgencies(): Observable<Agency[]> {
    if (!this.checkPermission('agency:read')) {
      // Return an empty array to allow the page to load without data
      return of([]);
    }
    return this.http.get<Agency[]>(`${environment.apiUrl}/api/agencies/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching agencies:', err);
        return throwError(() => err);
      })
    );
  }

  getAgencyById(id: number): Observable<Agency | null> {
    if (!this.checkPermission('agency:read')) {
      console.warn(`Cannot fetch agency with id ${id}: missing agency:read permission`);
      return of(null);
    }
    return this.http.get<Agency>(`${environment.apiUrl}/api/agencies/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching agency with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deleteAgency(id: number): Observable<void> {
    if (!this.checkPermission('agency:delete')) {
      console.warn(`Cannot delete agency with id ${id}: missing agency:delete permission`);
      return throwError(() => new Error('Missing permission: agency:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/agencies/delete/${id}`).pipe(
      tap(() => this.dataService.notifyDataChanged('delete')),
      catchError((err) => {
        console.error(`Error deleting agency with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addAgency(agency: Agency): Observable<Agency> {
    if (!this.checkPermission('agency:create')) {
      console.warn('Cannot add agency: missing agency:create permission');
      return throwError(() => new Error('Missing permission: agency:create'));
    }
    return this.http
      .post<Agency>(`${environment.apiUrl}/api/agencies/create`, agency, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((response) => {
          console.log('Agency added successfully:', response);
          this.dataService.notifyDataChanged('add');
        }),
        catchError((err) => {
          console.error('Error adding agency:', err);
          return throwError(() => err);
        })
      );
  }

  updateAgency(id: number, updatedAgency: Partial<Agency>): Observable<Agency> {
    if (!this.checkPermission('agency:update')) {
      console.warn(`Cannot update agency with id ${id}: missing agency:update permission`);
      return throwError(() => new Error('Missing permission: agency:update'));
    }
    return this.http
      .put<Agency>(`${environment.apiUrl}/api/agencies/modify/${id}`, updatedAgency, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap(() => this.dataService.notifyDataChanged("update")),
        catchError((err) => {
          console.error(`Error updating agency with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  activateAgency(id: number): Observable<Agency> {
    if (!this.checkPermission('agency:update')) {
      console.warn(`Cannot activate agency with id ${id}: missing agency:update permission`);
      return throwError(() => new Error('Missing permission: agency:update'));
    }
    return this.http
      .put<Agency>(`${environment.apiUrl}/api/agencies/activate/${id}`, {}, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.error(`Error activating agency with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  deactivateAgency(id: number): Observable<Agency> {
    if (!this.checkPermission('agency:update')) {
      console.warn(`Cannot deactivate agency with id ${id}: missing agency:update permission`);
      return throwError(() => new Error('Missing permission: agency:update'));
    }
    return this.http
      .put<Agency>(`${environment.apiUrl}/api/agencies/deactivate/${id}`, {}, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.error(`Error deactivating agency with id ${id}:`, err);
          return throwError(() => err);
        })
      );
  }

  exportAgenciesToExcel(): Observable<Blob> {
    if (!this.checkPermission('agency:read')) {
      console.warn('Cannot export agencies: missing agency:read permission');
      return throwError(() => new Error('Missing permission: agency:read'));
    }
    return this.http
      .get(`${environment.apiUrl}/api/agencies/export/excel`, {
        responseType: 'blob',
        headers: new HttpHeaders({ Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      })
      .pipe(
        catchError((err) => {
          console.error('Error exporting agencies to Excel:', err);
          return throwError(() => err);
        })
      );
  }
}