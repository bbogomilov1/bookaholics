import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/types/user';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/shared/auth.service';
import { appEmailValidator } from 'src/app/shared/validators/app-email-validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, appEmailValidator()]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
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
          this.cookieService.set(
            'currentUser',
            JSON.stringify({
              id: user.id,
              email: user.email,
              username: user.username,
            })
          );
          this.authService.login(user);
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      },
      (error) => {
        this.errorMessage =
          'An error occurred while logging-in. Please try again later.';
        throw new Error('Error fetching users:', error.message);
      }
    );
  }
}
