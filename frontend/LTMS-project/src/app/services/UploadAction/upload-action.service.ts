import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UploadActionDTO } from '../../interface/UploadAction/UploadAction';

@Injectable({
  providedIn: 'root'
})
export class UploadActionService {

  constructor(
    private http: HttpClient,
  ) {}

  // Get all upload actions
  getAllUploadActions(): Observable<UploadActionDTO[]> {
    return this.http.get<UploadActionDTO[]>(`${environment.apiUrl}/api/upload-actions/employee`).pipe(
          catchError((err) => {
            console.error('Error fetching employees:', err);
            return throwError(() => err);
          })
        );
  }

  // Download file associated with an upload action
  downloadActionFile(id: number) {
    const link = document.createElement('a');
    link.href = `${environment.apiUrl}/api/upload-actions/${id}/download`;
    link.download = 'sss.xlsx'; // You can set a default name for the downloaded fil
    link.click();
  }


}