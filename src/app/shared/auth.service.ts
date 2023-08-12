// auth.service.ts

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedSubject.asObservable();

  constructor(private cookieService: CookieService) {}

  login(): void {
    this.isLoggedSubject.next(true);
  }

  logout(): void {
    this.isLoggedSubject.next(false);
  }
}
