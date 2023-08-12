import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { appEmailValidator } from 'src/app/shared/validators/app-email-validator';
// import { matchPasswordsValidator } from 'src/app/shared/validators/match-passwords-validator';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/types/user';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, appEmailValidator()]],
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
  allUsersResponse = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  register() {
    if (this.form.invalid) {
      return;
    }

    const { username, email, passGroup: { password } = {} } = this.form.value;

    if (!password) {
      return;
    }

    this.userService.getAllUsers().subscribe(
      (allUsersResponse: User[]) => {
        const userEmailsSet = new Set<string>();

        for (const user of allUsersResponse) {
          if (user.email) {
            userEmailsSet.add(user.email);
          }
        }

        if (email && userEmailsSet.has(email)) {
          console.log('Email already exists');
          return;
        }

        this.userService
          .register(username!, email!, password!)
          .subscribe(() => {
            const currentUser = { username, email };
            this.cookieService.set(
              'currentUser',
              JSON.stringify(currentUser),
              1
            );

            this.router.navigate(['/']);
          });
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle error if needed
      }
    );
  }
}
