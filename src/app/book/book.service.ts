import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { Book } from '../types/book';
import { UserService } from '../user/user.service';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient, private userService: UserService) {}

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
    return this.http.get<{ [key: string]: Book }>(this.firebaseUrl);
  }

  addToBookshelf(book: Book): Observable<any> {
    const currentUserEmail = JSON.parse(
      this.userService.getLoggedInUserEmail()
    );
    const url = `${this.firebaseUrl}/users.json`;

    return this.http.get<User[]>(url).pipe(
      switchMap((users) => {
        const userId = Object.keys(users)[0];
        const usersArray = Object.values(users);

        const currentUser = usersArray.find(
          (user) => user.email === currentUserEmail.email
        );

        if (currentUser) {
          // Update the currentUser's bookshelf with the new book
          if (!currentUser.bookshelf) {
            currentUser.bookshelf = [];
          }
          currentUser.bookshelf.push(book);

          // Update the user's data in Firebase
          return this.http.patch<User>(
            `${this.firebaseUrl}/users/${userId}.json`,
            currentUser
          );
        }
        return of(null);
      })
    );
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
