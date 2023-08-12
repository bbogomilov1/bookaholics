import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function appEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email: string = control.value;
    if (email) {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!pattern.test(email)) {
        return { invalidEmail: true };
      }
    }
    return null;
  };
}
