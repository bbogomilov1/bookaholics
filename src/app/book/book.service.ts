import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
