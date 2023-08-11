import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { appEmailValidator } from 'src/app/shared/validators/app-email-validator';
// import { matchPasswordsValidator } from 'src/app/shared/validators/match-passwords-validator';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, appEmailValidator]],
    passGroup: this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(5)]],
        rePassword: ['', [Validators.required]],
      },
      {
        // validators: [matchPasswordsValidator('password', 'rePassword')],
      }
    ),
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  register(): void {
    if (this.form.invalid) {
      return;
    }

    const {
      username,
      email,
      passGroup: { password, rePassword } = {},
    } = this.form.value;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Add any other headers you need, e.g., authorization token
      }),
    };

    const requestBody = {
      username: username!,
      email: email!,
      password: password!,
      rePassword: rePassword!,
    };

    this.http
      .post<any>(
        'https://bookaholics-966d8-default-rtdb.firebaseio.com/users.json',
        requestBody,
        httpOptions
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
