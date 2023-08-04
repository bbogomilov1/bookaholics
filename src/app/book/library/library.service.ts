import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpenLibraryResponse } from 'src/app/types/open-library-response';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
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
