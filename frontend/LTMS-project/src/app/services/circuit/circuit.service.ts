import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Path } from '../../interface/circuit/circuit';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {

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

  getPaths(): Observable<Path[]> {
    if (!this.checkPermission('circuit:read')) {
      console.warn('Cannot fetch circuits: missing circuit:read permission');
      return of([]);
    }
    return this.http.get<Path[]>(`${environment.apiUrl}/api/circuits/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching circuits:', err);
        return throwError(() => err);
      })
    );
  }

  getPathById(id: number): Observable<Path | null> {
    if (!this.checkPermission('circuit:read')) {
      console.warn(`Cannot fetch circuit with id ${id}: missing circuit:read permission`);
      return of(null);
    }
    return this.http.get<Path>(`${environment.apiUrl}/api/circuits/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching circuit with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deletePath(id: number): Observable<void> {
    if (!this.checkPermission('circuit:delete')) {
      console.warn(`Cannot delete circuit with id ${id}: missing circuit:delete permission`);
      return throwError(() => new Error('Missing permission: circuit:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/circuits/delete/${id}`).pipe(
      catchError((err) => {
        console.error(`Error deleting circuit with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addPath(path: Path): Observable<Path> {
    if (!this.checkPermission('circuit:create')) {
      console.warn('Cannot add circuit: missing circuit:create permission');
      return throwError(() => new Error('Missing permission: circuit:create'));
    }
    return this.http.post<Path>(
      `${environment.apiUrl}/api/circuits/create`,
      path,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap((response) => {
        this.dataService.notifyDataChanged("add");
      }),
      catchError((err) => {
        console.error('Error creating circuit:', err);
        return throwError(() => err);
      })
    );
  }

  updatePath(id: number, updatedPath: Partial<Path>): Observable<Path> {
    if (!this.checkPermission('circuit:update')) {
      console.warn(`Cannot update circuit with id ${id}: missing circuit:update permission`);
      return throwError(() => new Error('Missing permission: circuit:update'));
    }
    return this.http.put<Path>(
      `${environment.apiUrl}/api/circuits/modify/${id}`,
      updatedPath,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap(() => {
        this.dataService.notifyDataChanged("update");
      }),
      catchError((err) => {
        console.error(`Error updating circuit with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  activatePath(id: number): Observable<Path> {
    if (!this.checkPermission('circuit:status')) {
      console.warn(`Cannot activate circuit with id ${id}: missing circuit:status permission`);
      return throwError(() => new Error('Missing permission: circuit:status'));
    }
    return this.http.put<Path>(
      `${environment.apiUrl}/api/circuits/${id}/activate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error activating circuit with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deactivatePath(id: number): Observable<Path> {
    if (!this.checkPermission('circuit:status')) {
      console.warn(`Cannot deactivate circuit with id ${id}: missing circuit:status permission`);
      return throwError(() => new Error('Missing permission: circuit:status'));
    }
    return this.http.put<Path>(
      `${environment.apiUrl}/api/circuits/${id}/deactivate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error deactivating circuit with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  importPaths(file: FormData): Observable<any> {
    if (!this.checkPermission('circuit:import')) {
      console.warn('Cannot import circuits: missing circuit:import permission');
      return throwError(() => new Error('Missing permission: circuit:import'));
    }
    return this.http.post(`${environment.apiUrl}/import`, file).pipe(
      catchError((err) => {
        console.error('Error importing circuits:', err);
        return throwError(() => err);
      })
    );
  }

  exportCircuitToExcel(): Observable<Blob> {
    if (!this.checkPermission('circuit:read')) {
      console.warn('Cannot export circuits: missing circuit:read permission');
      return throwError(() => new Error('Missing permission: circuit:read'));
    }
    return this.http.get(
      `${environment.apiUrl}/api/circuits/export/excel`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }
    ).pipe(
      catchError((err) => {
        console.error('Error exporting circuits to Excel:', err);
        return throwError(() => err);
      })
    );
  }
}