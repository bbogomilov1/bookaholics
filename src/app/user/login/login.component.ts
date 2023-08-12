import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/types/user';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.value;

    if (!password) {
      return;
    }

    this.userService.getAllUsers().subscribe(
      (allUsersResponse: User[]) => {
        const user = allUsersResponse.find((user) => user.email === email);

        if (user && user.password === password) {
          this.cookieService.set('currentUser', JSON.stringify(user), 1);
          this.authService.login();
          console.log('Logged in successfully');
          this.router.navigate(['/']);
        } else {
          console.log('Invalid email or password');
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
