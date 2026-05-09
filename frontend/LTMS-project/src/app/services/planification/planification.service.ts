import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PlanificationDTO } from '../../interface/planification/planificatio';
import { PlanificationRequestDTO } from '../../interface/planification/planificationRequestDTO';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlanificationService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private checkPermission(permission: string): boolean {
    if (!this.authService.hasPermission(permission)) {
      console.warn(`Missing permission: ${permission}`);
      return false;
    }
    return true;
  }

  getAll(): Observable<PlanificationDTO[]> {
    if (!this.checkPermission('planification:read')) {
      console.warn('Cannot fetch planifications: missing planification:read permission');
      return of([]);
    }
    return this.http.get<PlanificationDTO[]>(`${environment.apiUrl}/api/planifications/getAll`).pipe(
      catchError((err) => {
        console.error('Error fetching planifications:', err);
        return throwError(() => err);
      })
    );
  }

  uploadFile(requestDTO: PlanificationRequestDTO, url: string): Observable<any> {
    if (!this.checkPermission('planification:create')) {
      console.warn('Cannot upload planification file: missing planification:create permission');
      return throwError(() => new Error('Missing permission: planification:create'));
    }
    console.log('Request DTO:', requestDTO);
    const formData = new FormData();
    formData.append('week', requestDTO.week);
    formData.append('file', requestDTO.file);
    formData.append('userId', requestDTO.userId.toString());
    if (requestDTO.plantSectionId) {
      formData.append('plantSectionId', requestDTO.plantSectionId.toString());
    }
    return this.http.post(`${environment.apiUrl}${url}`, formData).pipe(
      catchError((err) => {
        console.error('Error uploading planification file:', err);
        return throwError(() => err);
      })
    );
  }

  downloadTemplate(): Observable<Blob> {
    if (!this.checkPermission('planification:export')) {
      console.warn('Cannot download planification template: missing planification:export permission');
      return throwError(() => new Error('Missing permission: planification:export'));
    }
    return this.http.get(`${environment.apiUrl}/api/planifications/template`, {
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

  downloadFile(id: number): Observable<Blob> {
    if (!this.checkPermission('planification:read')) {
      console.warn(`Cannot download planification file with id ${id}: missing planification:read permission`);
      return throwError(() => new Error('Missing permission: planification:read'));
    }
    return this.http.get(`${environment.apiUrl}/api/upload-actions/${id}/download`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }).pipe(
      catchError((err) => {
        console.error(`Error downloading planification file with id ${id}:`, err);
        return throwError(() => err);
      })
    );
  }
}