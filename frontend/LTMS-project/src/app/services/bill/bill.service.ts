import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private readonly apiUrl = `${environment.apiUrl}/api/bill`;

  constructor(private http: HttpClient) { }

  generateBillExcel(agencyId: number, year: number, month: number): Observable<Blob> {
    const params = new HttpParams()
      .set('agencyId', agencyId.toString())
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get(`${this.apiUrl}/generate`, { params, responseType: 'blob' });
  }
}