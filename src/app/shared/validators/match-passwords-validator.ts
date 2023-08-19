import { FormGroup, ValidatorFn } from '@angular/forms';

export function matchPasswordsValidator(
  passwordControlOne: string,
  passwordControlTwo: string
): ValidatorFn {
  return (control) => {
    const group = control as FormGroup;
    const passCtrl1 = group.get(passwordControlOne);
    const passCtrl2 = group.get(passwordControlTwo);

    return passCtrl1?.value === passCtrl2?.value
      ? null
      : { passwordsNotMatch: true };
  };
}
