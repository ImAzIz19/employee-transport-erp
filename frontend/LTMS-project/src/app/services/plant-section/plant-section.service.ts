import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PlantSection } from '../../interface/plant-section/plant-section';
import { environment } from '../../environments/environment';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlantSectionService {

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

  getPlantSections(): Observable<PlantSection[]> {
    if (!this.checkPermission('plant_section:read')) {
      console.warn('Cannot fetch plant sections: missing plant_section:read permission');
      return of([]);
    }
    return this.http.get<PlantSection[]>(`${environment.apiUrl}/api/plant-sections/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching plant sections:', err);
        return throwError(() => err);
      })
    );
  }

  getPlantSectionById(id: number): Observable<PlantSection | null> {
    if (!this.checkPermission('plant_section:read')) {
      console.warn(`Cannot fetch plant section with id ${id}: missing plant_section:read permission`);
      return of(null);
    }
    return this.http.get<PlantSection>(`${environment.apiUrl}/api/plant-sections/get/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching plant section with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deletePlantSection(id: number): Observable<void> {
    if (!this.checkPermission('plant_section:delete')) {
      console.warn(`Cannot delete plant section with id ${id}: missing plant_section:delete permission`);
      return throwError(() => new Error('Missing permission: plant_section:delete'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/api/plant-sections/delete/${id}`).pipe(
      catchError((err) => {
        console.error(`Error deleting plant section with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  addPlantSection(plantSection: PlantSection): Observable<PlantSection> {
    if (!this.checkPermission('plant_section:create')) {
      console.warn('Cannot add plant section: missing plant_section:create permission');
      return throwError(() => new Error('Missing permission: plant_section:create'));
    }
    return this.http.post<PlantSection>(
      `${environment.apiUrl}/api/plant-sections/create`,
      plantSection,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap((response) => {
        this.dataService.notifyDataChanged("add");
      }),
      catchError((err) => {
        console.error('Error adding plant section:', err);
        return throwError(() => err);
      })
    );
  }

  updatePlantSection(id: number, updatedPlantSection: Partial<PlantSection>): Observable<PlantSection> {
    if (!this.checkPermission('plant_section:update')) {
      console.warn(`Cannot update plant section with id ${id}: missing plant_section:update permission`);
      return throwError(() => new Error('Missing permission: plant_section:update'));
    }
    return this.http.put<PlantSection>(
      `${environment.apiUrl}/api/plant-sections/modify/${id}`,
      updatedPlantSection,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap(() => {
        this.dataService.notifyDataChanged("update");
      }),
      catchError((err) => {
        console.error(`Error updating plant section with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  activatePlantSection(id: number): Observable<PlantSection> {
    if (!this.checkPermission('plant_section:status')) {
      console.warn(`Cannot activate plant section with id ${id}: missing plant_section:status permission`);
      return throwError(() => new Error('Missing permission: plant_section:status'));
    }
    return this.http.put<PlantSection>(
      `${environment.apiUrl}/api/plant-sections/${id}/activate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error activating plant section with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  deactivatePlantSection(id: number): Observable<PlantSection> {
    if (!this.checkPermission('plant_section:status')) {
      console.warn(`Cannot deactivate plant section with id ${id}: missing plant_section:status permission`);
      return throwError(() => new Error('Missing permission: plant_section:status'));
    }
    return this.http.put<PlantSection>(
      `${environment.apiUrl}/api/plant-sections/${id}/deactivate`,
      {},
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError((err) => {
        console.error(`Error deactivating plant section with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  exportPlantSectionsToExcel(): Observable<Blob> {
    if (!this.checkPermission('plant_section:read')) {
      console.warn('Cannot export plant sections: missing plant_section:read permission');
      return throwError(() => new Error('Missing permission: plant_section:read'));
    }
    return this.http.get(
      `${environment.apiUrl}/api/plant-sections/export/excel`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }
    ).pipe(
      catchError((err) => {
        console.error('Error exporting plant sections to Excel:', err);
        return throwError(() => err);
      })
    );
  }
}