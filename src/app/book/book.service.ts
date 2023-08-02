import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get<any>(this.apiUrl, { params });
  }
}
