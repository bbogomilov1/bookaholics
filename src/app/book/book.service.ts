import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { Book } from '../types/book';
import { UserService } from '../user/user.service';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient, private userService: UserService) {}

  getBookByVersion(version: string): Observable<Book | null> {
    const currentUserEmail = JSON.parse(
      this.userService.getLoggedInUserEmail()
    );

    return this.http
      .get<{ [key: string]: User }>(`${this.firebaseUrl}/users.json`)
      .pipe(
        switchMap((users) => {
          const userIds = Object.keys(users);
          const usersArray = Object.values(users);

          const currentUser = usersArray.find(
            (user) => user.email === currentUserEmail.email
          );

          if (currentUser) {
            const userId = userIds.find(
              (id) => users[id].email === currentUser.email
            );

            if (userId && currentUser.bookshelf) {
              const book = currentUser.bookshelf.find(
                (b) => b._version_ === version
              );

              if (book) {
                return of(book);
              }
            }
          }
          return of(null);
        })
      );
  }

  addToBookshelf(book: Book): Observable<any> {
    const currentUserEmail = JSON.parse(
      this.userService.getLoggedInUserEmail()
    );

    return this.http
      .get<{ [key: string]: User }>(`${this.firebaseUrl}/users.json`)
      .pipe(
        switchMap((users) => {
          const userIds = Object.keys(users);
          const usersArray = Object.values(users);

          const currentUser = usersArray.find(
            (user) => user.email === currentUserEmail.email
          );

          if (currentUser) {
            const userId = userIds.find(
              (id) => users[id].email === currentUser.email
            );

            if (userId) {
              if (!currentUser.bookshelf) {
                currentUser.bookshelf = [];
              }
              currentUser.bookshelf.push(book);

              return this.http.patch<User>(
                `${this.firebaseUrl}/users/${userId}.json`,
                currentUser
              );
            }
          }
          return of(null);
        })
      );
  }

  updateInBookshelf(updatedBook: Book): Observable<any> {
    const currentUserEmail = JSON.parse(
      this.userService.getLoggedInUserEmail()
    );

    return this.http
      .get<{ [key: string]: User }>(`${this.firebaseUrl}/users.json`)
      .pipe(
        switchMap((users) => {
          const userIds = Object.keys(users);
          const usersArray = Object.values(users);

          const currentUser = usersArray.find(
            (user) => user.email === currentUserEmail.email
          );

          if (currentUser) {
            const userId = userIds.find(
              (id) => users[id].email === currentUser.email
            );

            if (userId) {
              if (!currentUser.bookshelf) {
                currentUser.bookshelf = [];
              }
              const bookIndex = currentUser.bookshelf.findIndex(
                (b) => b._version_ === updatedBook._version_
              );

              if (bookIndex !== -1) {
                currentUser.bookshelf[bookIndex] = updatedBook;
                return this.http.patch<User>(
                  `${this.firebaseUrl}/users/${userId}.json`,
                  currentUser
                );
              }
            }
          }
          return of(null);
        })
      );
  }

  removeFromBookshelf(book: Book): Observable<any> {
    const currentUserEmail = JSON.parse(
      this.userService.getLoggedInUserEmail()
    );

    return this.http
      .get<{ [key: string]: User }>(`${this.firebaseUrl}/users.json`)
      .pipe(
        switchMap((users) => {
          const userIds = Object.keys(users);
          const usersArray = Object.values(users);

          const currentUser = usersArray.find(
            (user) => user.email === currentUserEmail.email
          );

          if (currentUser) {
            const userId = userIds.find(
              (id) => users[id].email === currentUser.email
            );

            if (userId) {
              if (!currentUser.bookshelf) {
                currentUser.bookshelf = [];
              }
              const bookIndex = currentUser.bookshelf.findIndex(
                (b) => b._version_ === book._version_
              );
              currentUser.bookshelf.splice(bookIndex, 1);
              return this.http.patch<User>(
                `${this.firebaseUrl}/users/${userId}.json`,
                currentUser
              );
            }
          }
          return of(null);
        })
      );
  }

  getAllBooksFromBookshelf(
    userId: string
  ): Observable<{ [key: string]: Book }> {
    const url = `${this.firebaseUrl}/users/${userId}/bookshelf.json`;
    return this.http.get<{ [key: string]: Book }>(url);
  }
}
