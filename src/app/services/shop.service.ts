import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Contact { phone?: string; email?: string }
export interface Shop { _id?: string; name: string; box?: {_id : string,code: string} | null; rent: number; contact?: Contact | null; images?: string[]; description?: string }

@Injectable({ providedIn: 'root' })
export class ShopService {
  private api = (environment?.apiUrl || 'http://localhost:3000') + '/shops';

  constructor(private http: HttpClient) {}

  list(): Observable<Shop[]> {
    try { return this.http.get<Shop[]>(this.api); } catch { return of(this.localList()); }
  }

  get(id: string): Observable<Shop | null> {
    try { return this.http.get<Shop>(`${this.api}/${id}`); } catch { return of(this.localList().find(s => s._id === id) || null); }
  }

  create(shop: Shop): Observable<Shop> {
    try { return this.http.post<Shop>(this.api, shop); } catch {
      const created = { ...shop, _id: 'shop_' + Date.now() } as Shop;
      const s = this.localList(); s.push(created); localStorage.setItem('cc_shops', JSON.stringify(s));
      return of(created);
    }
  }

  update(id: string, shop: Shop): Observable<Shop> {
    try { return this.http.put<Shop>(`${this.api}/${id}`, shop); } catch {
      const s = this.localList(); const idx = s.findIndex(sh => sh._id === id); if (idx !== -1) s[idx] = { ...s[idx], ...shop } as Shop; localStorage.setItem('cc_shops', JSON.stringify(s));
      return of(s[idx]);
    }
  }

  delete(id: string): Observable<any> {
    try { return this.http.delete(`${this.api}/${id}`); } catch {
      const s = this.localList().filter(sh => sh._id !== id); localStorage.setItem('cc_shops', JSON.stringify(s));
      return of({});
    }
  }

  private localList(): Shop[] {
    try { return JSON.parse(localStorage.getItem('cc_shops') || '[]'); } catch { return []; }
  }
}
