import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BusPlanRequestDTO } from '../../interface/busPlanDTO/busPlanRequestDTO';
import { BusPlanDTO } from '../../interface/busPlanDTO/busPlanDTO';

@Injectable({
  providedIn: 'root'
})
export class BusPlanificationService {

  constructor(private http: HttpClient) {}

  // Search bus plans by week
  getAllByWeek(request: BusPlanRequestDTO): Observable<BusPlanDTO[]> {
    return this.http.post<BusPlanDTO[]>(`${environment.apiUrl}/api/bus-plans/search`, request);
  }

  // Search bus plans by agency
  getByAgency(request: BusPlanRequestDTO): Observable<BusPlanDTO[]> {
    return this.http.post<BusPlanDTO[]>(`${environment.apiUrl}/api/bus-plans/search-by-agency`, request);
  }

  // Modify a bus plan
  modifyBusPlan(request: BusPlanRequestDTO): Observable<BusPlanDTO> {
    return this.http.put<BusPlanDTO>(`${environment.apiUrl}/api/bus-plans/modify`, request);
  }

  // Get last modified bus plans
  getLastModified(): Observable<BusPlanDTO[]> {
    return this.http.get<BusPlanDTO[]>(`${environment.apiUrl}/api/bus-plans/last-modified`);
  }

  // Get last modified bus plans by agency
  getLastModifiedByAgency(agencyId: number): Observable<BusPlanDTO[]> {
    return this.http.get<BusPlanDTO[]>(`${environment.apiUrl}/api/bus-plans/last-modified-by-agency/${agencyId}`);
  }


  notifyAgency(agencyId: number, week: string): Observable<string> {
  return this.http.get<string>(
    `${environment.apiUrl}/api/bus-plans/notify-Agency?agencyId=${agencyId}&week=${week}`,
    { responseType: 'text' as 'json' }
  );
}
}