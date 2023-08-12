import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { User } from '../types/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  tap,
  of,
} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit, OnDestroy {
  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  public user$ = this.user$$.asObservable();

  user: User | undefined;
  USER_KEY = '[user]';

  get isLogged(): boolean {
    return !!this.user;
  }

  subscription: Subscription;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.subscription = this.user$.subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    const storedUser = this.cookieService.get('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.user$$.next(user);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<User>(`${this.firebaseUrl}/users.json`, { email, password })
      .pipe(tap((user) => this.user$$.next(user)));
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<{ [key: string]: any }>(`${this.firebaseUrl}/users.json`)
      .pipe(
        map((response) => {
          if (response === null) {
            return []; // Return an empty array if response is null
          }
          return Object.values(response);
        }),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]); // Return an empty array in case of error
        })
      );
  }

  getLoggedInUserEmail(): string {
    return this.cookieService.get('currentUser');
  }

  // updateUser(user: User): Observable<User> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   };

  //   return this.http.put<User>(
  //     `${this.firebaseUrl}/users/${user.id}.json`,
  //     user,
  //     httpOptions
  //   );
  // }

  register(userId: string, username: string, email: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const requestBody = {
      id: userId,
      username: username!,
      email: email!,
      password: password!,
    };

    return this.http
      .post<User>(`${this.firebaseUrl}/users.json`, requestBody, httpOptions)
      .pipe(tap((user) => this.user$$.next(user)));
  }

  logout() {
    this.cookieService.delete('currentUser');
    this.user$$.next(undefined);
  }

  // getProfile() {
  //   return this.http
  //     .get<User>('/api/users/profile')
  //     .pipe(tap((user) => this.user$$.next(user)));
  // }

  // updateProfile(username: string, email: string, tel?: string) {
  //   return this.http
  //     .put<User>('/api/users/profile', { username, email, tel })
  //     .pipe(tap((user) => this.user$$.next(user)));
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
