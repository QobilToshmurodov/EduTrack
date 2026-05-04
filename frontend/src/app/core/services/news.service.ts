import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsDto } from '@shared/models/common.models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private base = '/News';

  getAll(): Observable<NewsDto[]> {
    return this.http.get<NewsDto[]>(this.base);
  }

  getLatest(count: number): Observable<NewsDto[]> {
    return this.http.get<NewsDto[]>(`${this.base}/latest/${count}`);
  }

  getById(id: number): Observable<NewsDto> {
    return this.http.get<NewsDto>(`${this.base}/${id}`);
  }

  create(data: { title: string; content: string; imageUrl?: string; isPublished: boolean }): Observable<NewsDto> {
    return this.http.post<NewsDto>(this.base, data);
  }

  update(id: number, data: { title: string; content: string; imageUrl?: string; isPublished: boolean }): Observable<NewsDto> {
    return this.http.put<NewsDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.base}/upload-image`, formData);
  }

  /** Convert relative image URL from API to full URL for display */
  getFullImageUrl(imageUrl: string | undefined | null): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${imageUrl}`;
  }
}