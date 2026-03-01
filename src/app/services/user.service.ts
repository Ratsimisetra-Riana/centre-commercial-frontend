import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User { _id?: string; name: string; email: string; passwordHash?: string; password?: string; role: string; shopId?: string | null; isActive: boolean }

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = (environment?.apiUrl || 'http://localhost:3000') + '/users';

  constructor(private http: HttpClient) {}

  list(): Observable<User[]> {
    try { return this.http.get<User[]>(this.api); } catch { return of(this.localList()); }
  }

  get(id: string): Observable<User | null> {
    try { return this.http.get<User>(`${this.api}/${id}`); } catch { return of(this.localList().find(u => u._id === id) || null); }
  }

  create(user: User): Observable<User> {
    console.log("Creating user:", user);
    try { return this.http.post<User>(this.api+"/admin/create-user", user); } catch {
      const created = { ...user, _id: 'user_' + Date.now() } as User;
      const s = this.localList(); s.push(created); localStorage.setItem('cc_users', JSON.stringify(s));
      return of(created);
    }
  }

  update(id: string, user: User): Observable<User> {
    try { return this.http.put<User>(`${this.api}/${id}`, user); } catch {
      const s = this.localList(); const idx = s.findIndex(u => u._id === id); if (idx !== -1) s[idx] = { ...s[idx], ...user } as User; localStorage.setItem('cc_users', JSON.stringify(s));
      return of(s[idx]);
    }
  }

  delete(id: string): Observable<any> {
    try { return this.http.delete(`${this.api}/${id}`); } catch {
      const s = this.localList().filter(u => u._id !== id); localStorage.setItem('cc_users', JSON.stringify(s));
      return of({});
    }
  }

  private localList(): User[] {
    try { return JSON.parse(localStorage.getItem('cc_users') || '[]'); } catch { return []; }
  }
}
