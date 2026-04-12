import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  // Универсальный GET для любого списка
  getAll<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }

  // Универсальный POST
  create<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data);
  }

  // Универсальный PUT
  update<T>(url: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${url}/${id}`, data);
  }

  // Универсальный DELETE
  delete(url: string, id: number): Observable<any> {
    return this.http.delete(`${url}/${id}`);
  }

  // Специфичный метод для обновления роли
  updateUserRole(userId: number, roleId: number): Observable<any> {
    const roleUrl = API_URLS.USER_ROLE(userId);
    return this.http.patch(roleUrl, null, { params: { roleId: roleId.toString() } });
  }
}
