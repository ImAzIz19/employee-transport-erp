// shifts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShiftDTO } from '../../interface/shift/shift';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private apiUrl = `${environment.apiUrl}/api/shifts`;

  constructor(private http: HttpClient) { }

  getAllShifts(): Observable<ShiftDTO[]> {
    return this.http.get<ShiftDTO[]>(`${this.apiUrl}/get-all`).pipe(
      catchError(this.handleError)
    );
  }

  addShift(shift: ShiftDTO): Observable<ShiftDTO> {
    return this.http.post<ShiftDTO>(`${this.apiUrl}/add`, shift).pipe(
      catchError(this.handleError)
    );
  }

  modifyShift(id: number, shift: ShiftDTO): Observable<ShiftDTO> {
    return this.http.put<ShiftDTO>(`${this.apiUrl}/modify/${id}`, shift).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 400) {
        errorMessage = 'Bad request. Please check your data';
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = 'Unauthorized access';
      } else if (error.status >= 500) {
        errorMessage = 'Server error occurred';
      }
      
      // You can add more specific error messages based on your API's error responses
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}