import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Segment } from '../../interface/Segment/Segment';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SegmentService {

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

  getSegments(): Observable<Segment[]> {
    if (!this.checkPermission('segment:read')) {
      console.warn('Cannot fetch segments: missing segment:read permission');
      return of([]);
    }
    return this.http.get<Segment[]>(`${environment.apiUrl}/api/segments/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching segments:', err);
        return throwError(() => err);
      })
    );
  }

  getSegmentById(id: number): Observable<Segment | null> {
    if (!this.checkPermission('segment:read')) {
      console.warn(`Cannot fetch segment with id ${id}: missing segment:read permission`);
      return of(null);
    }
    return this.http.get<Segment>(`${environment.apiUrl}/api/segments/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching segment with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deleteSegment(id: number): Observable<void> {
    if (!this.checkPermission('segment:delete')) {
      console.warn(`Cannot delete segment with id ${id}: missing segment:delete permission`);
      return throwError(() => new Error('Missing permission: segment:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/segments/delete/${id}`).pipe(
      catchError((err) => {
        console.error(`Error deleting segment with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addSegment(segment: Segment): Observable<Segment> {
    if (!this.checkPermission('segment:create')) {
      console.warn('Cannot add segment: missing segment:create permission');
      return throwError(() => new Error('Missing permission: segment:create'));
    }
    return this.http.post<Segment>(
      `${environment.apiUrl}/api/segments/create`,
      segment,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap((response) => {
        this.dataService.notifyDataChanged("add");
      }),
      catchError((err) => {
        console.error('Error creating segment:', err);
        return throwError(() => err);
      })
    );
  }

  updateSegment(id: number, updatedSegment: Partial<Segment>): Observable<Segment> {
    if (!this.checkPermission('segment:update')) {
      console.warn(`Cannot update segment with id ${id}: missing segment:update permission`);
      return throwError(() => new Error('Missing permission: segment:update'));
    }
    return this.http.put<Segment>(
      `${environment.apiUrl}/api/segments/modify/${id}`,
      updatedSegment,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap(() => {
        this.dataService.notifyDataChanged("update");
      }),
      catchError((err) => {
        console.error(`Error updating segment with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  activateSegment(id: number): Observable<Segment> {
    if (!this.checkPermission('segment:status')) {
      console.warn(`Cannot activate segment with id ${id}: missing segment:status permission`);
      return throwError(() => new Error('Missing permission: segment:status'));
    }
    return this.http.put<Segment>(
      `${environment.apiUrl}/api/segments/${id}/activate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error activating segment with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deactivateSegment(id: number): Observable<Segment> {
    if (!this.checkPermission('segment:status')) {
      console.warn(`Cannot deactivate segment with id ${id}: missing segment:status permission`);
      return throwError(() => new Error('Missing permission: segment:status'));
    }
    return this.http.put<Segment>(
      `${environment.apiUrl}/api/segments/${id}/deactivate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error deactivating segment with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  exportSegmentsToExcel(): Observable<Blob> {
    if (!this.checkPermission('segment:read')) {
      console.warn('Cannot export segments: missing segment:read permission');
      return throwError(() => new Error('Missing permission: segment:read'));
    }
    return this.http.get(
      `${environment.apiUrl}/api/segments/export/excel`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }
    ).pipe(
      catchError((err) => {
        console.error('Error exporting segments to Excel:', err);
        return throwError(() => err);
      })
    );
  }
}