import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor() {}

  login(user: any): void {
    this.isLoggedSubject.next(true);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.isLoggedSubject.next(false);
    this.currentUserSubject.next(null);
  }
}
