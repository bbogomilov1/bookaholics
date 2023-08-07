import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
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

  removeFromBookshelf(book: Book): Observable<any> {
    return this.http
      .get<{ [key: string]: Book }>(`${this.firebaseUrl}/bookshelf.json`)
      .pipe(
        map((response) => {
          const bookKey = Object.keys(response).find(
            (key) => response[key]._version_ === book._version_
          );

          if (bookKey) {
            // Delete the book from Firebase
            return this.http.delete(
              `${this.firebaseUrl}/bookshelf/-NbF1k3DqFDGO1eJNnsu.json`
            );
          }

          // Return null if the book doesn't exist in Firebase
          return null;
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
}
