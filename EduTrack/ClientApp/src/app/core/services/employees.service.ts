import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private http = inject(HttpClient);
  private base = '/Employees';

  getAll(): Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(this.base);
  }

  getById(id: number): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.base}/${id}`);
  }

  getByUserId(userId: number): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.base}/by-user/${userId}`);
  }

  create(data: { fullName: string; username: string; password: string; email?: string; phone?: string; professionId?: number }): Observable<EmployeeDto> {
    return this.http.post<EmployeeDto>(this.base, data);
  }

  update(id: number, data: { fullName: string; email?: string; phone?: string; professionId?: number }): Observable<EmployeeDto> {
    return this.http.put<EmployeeDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
