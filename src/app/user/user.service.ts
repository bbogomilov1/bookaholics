import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../types/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private firebaseUrl = 'https://bookaholics-966d8-default-rtdb.firebaseio.com';

  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  public user$ = this.user$$.asObservable();

  user: User | undefined;
  USER_KEY = '[user]';

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

    return this.http.post<any>(
      `${this.firebaseUrl}/users.json`,
      requestBody,
      httpOptions
    );
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
