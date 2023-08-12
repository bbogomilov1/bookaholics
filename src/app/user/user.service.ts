import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../types/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  tap,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  public user$ = this.user$$.asObservable();

  user: User | undefined;
  // USER_KEY = '[user]';

  get isLogged(): boolean {
    return !!this.user;
  }

  subscription: Subscription;

  constructor(private http: HttpClient) {
    this.subscription = this.user$.subscribe((user) => (this.user = user));
  }

  // login(email: string, password: string) {
  //   return this.http
  //     .post<User>('/api/login', { email, password })
  //     .pipe(tap((user) => this.user$$.next(user)));
  // }

  checkEmail(email: string) {
    const queryParams = `?orderBy="email"&equalTo="${email}"`;
    return this.http
      .get<{ [key: string]: User }>(
        `${this.firebaseUrl}/users.json${queryParams}`
      )
      .pipe(
        map((response) => {
          // Convert the response to an array of users
          const users: User[] = Object.values(response);
          // Check if any user with the given email exists
          return users.length > 0;
        }),
        catchError((error) => {
          console.error('Error checking email:', error);
          return [];
        })
      );
  }

  getAllUsers(): Observable<{ [key: string]: any }> {
    return this.http
      .get<{ [key: string]: any }>(`${this.firebaseUrl}/users.json`)
      .pipe();
  }

  register(username: string, email: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const requestBody = {
      username: username!,
      email: email!,
      password: password!,
    };

    return this.http
      .post<User>(`${this.firebaseUrl}/users.json`, requestBody, httpOptions)
      .pipe(tap((user) => this.user$$.next(user)));
  }

  // logout() {
  //   return this.http
  //     .post<User>('/api/logout', {})
  //     .pipe(tap(() => this.user$$.next(undefined)));
  // }

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
