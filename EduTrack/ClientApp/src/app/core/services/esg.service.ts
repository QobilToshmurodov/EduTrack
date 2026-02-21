import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ESGDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class ESGService {
  private http = inject(HttpClient);
  private base = '/ESG';

  getAll(): Observable<ESGDto[]> {
    return this.http.get<ESGDto[]>(this.base);
  }

  getByEmployee(employeeId: number): Observable<ESGDto[]> {
    return this.http.get<ESGDto[]>(`${this.base}/by-employee/${employeeId}`);
  }

  create(data: { employeeId: number; subjectId: number; groupId: number }): Observable<ESGDto> {
    return this.http.post<ESGDto>(this.base, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
