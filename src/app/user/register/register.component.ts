import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { appEmailValidator } from 'src/app/shared/validators/app-email-validator';
import { matchPasswordsValidator } from 'src/app/shared/validators/match-passwords-validator';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/types/user';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, appEmailValidator()]],
    passGroup: this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(5)]],
        rePassword: ['', [Validators.required]],
      },
      {
        validators: [matchPasswordsValidator('password', 'rePassword')],
      }
    ),
  });

  allUsersResponse = {};
  errorMessageEmail: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  register() {
    if (this.form.invalid) {
      return;
    }

    const { username, email, passGroup: { password } = {} } = this.form.value;

    if (!password) {
      return;
    }

    const userId = uuid();

    this.userService.getAllUsers().subscribe(
      (allUsersResponse: User[]) => {
        if (allUsersResponse.length === 0) {
          allUsersResponse = [];
        }
        const userEmailsSet = new Set<string>();

        for (const user of allUsersResponse) {
          if (user.email) {
            userEmailsSet.add(user.email);
          }
        }

        if (email && userEmailsSet.has(email)) {
          this.errorMessageEmail = 'Email already exists';
          return;
        }

        this.userService
          .register(userId, username!, email!, password!)
          .subscribe(() => {
            this.router.navigate(['/user/login']);
          });
      },
      (error) => {
        this.errorMessage =
          'An error occurred while registering. Please try again later.';
        throw new Error('Error fetching users:', error.message);
      }
    );
  }
}
