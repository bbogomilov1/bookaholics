import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function coverUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const coverUrl: string = control.value;
    if (coverUrl) {
      const pattern = /^(https?:\/\/)/;
      if (!pattern.test(coverUrl)) {
        return { invalidCoverUrl: true };
      }
    }
    return null;
  };
}
