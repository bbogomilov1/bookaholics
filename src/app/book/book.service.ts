import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
