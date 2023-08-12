import { Component } from '@angular/core';
import { UserService } from './user/user.service';
import { AuthService } from './shared/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'bookaholics';
  isLogged$ = this.authService.isLoggedIn$;

  constructor(
    public userService: UserService,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  logout(): void {
    this.cookieService.delete('currentUser');
    this.authService.logout();
  }
}
