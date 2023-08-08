import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { Book } from '../types/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  addBook(book: Book): Observable<any> {
    const url = `${this.firebaseUrl}/books.json`;
    return this.http.post(url, book);
  }

  private getBookKey(version: string): Observable<string | null> {
    return this.http
      .get<{ [key: string]: Book }>(`${this.firebaseUrl}/bookshelf.json`)
      .pipe(
        map((response) => {
          const bookKey = Object.keys(response).find(
            (key) => response[key]._version_ === version
          );
          return bookKey ? bookKey : null;
        })
      );
  }

  removeFromBookshelf(book: Book): Observable<any> {
    return this.getBookKey(book._version_).pipe(
      switchMap((bookKey) => {
        if (bookKey) {
          return this.http.delete(
            `${this.firebaseUrl}/bookshelf/${bookKey}.json`
          );
        } else {
          return of(null);
        }
      })
    );
  }

  getAllBooks(): Observable<{ [key: string]: Book }> {
    const url = `${this.firebaseUrl}/books.json`;
    return this.http.get<{ [key: string]: Book }>(url);
  }

  addToBookshelf(book: Book): Observable<any> {
    const url = `${this.firebaseUrl}/bookshelf.json`;
    return this.http.post(url, book);
  }

  getAllBooksFromBookshelf(): Observable<{ [key: string]: Book }> {
    const url = `${this.firebaseUrl}/bookshelf.json`;
    return this.http.get<{ [key: string]: Book }>(url);
  }

  getAllBooksFromBooks(): Observable<{ [key: string]: Book }> {
    const url = `${this.firebaseUrl}/books.json`;
    return this.http.get<{ [key: string]: Book }>(url);
  }
}
