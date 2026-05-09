import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotisationService {
  private readonly apiUrl = `${environment.apiUrl}/api/cotisation`;

  constructor(private http: HttpClient) { }

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/template`, { responseType: 'blob' });
  }

  importExonerationData(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import-exoneration`, formData);
  }

  getEmployeesByPlantSectionAndPeriod(month: number, year: number, psId: number): Observable<Blob> {
    const params = new HttpParams()
      .set('month', month)
      .set('year', year)
      .set('psId', psId);
    return this.http.get(`${this.apiUrl}/employees`, { params, responseType: 'blob' });
  }
}