import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpenLibraryResponse } from '../types/open-library-response';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(
    searchQuery: string,
    limit: number
  ): Observable<OpenLibraryResponse> {
    const url = `${this.apiUrl}?q=${searchQuery}&limit=${limit}`;
    return this.http.get<OpenLibraryResponse>(url);
  }
}
