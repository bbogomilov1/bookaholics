import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './shared/auth.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLogged: boolean = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLogged = loggedIn;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    const currentUserCookie = this.cookieService.get('currentUser');

    if (currentUserCookie) {
      const currentUser = JSON.parse(currentUserCookie);
      this.authService.login(currentUser);
    }
  }

  logout(): void {
    this.userService.logout();
    this.authService.logout();
  }
}
