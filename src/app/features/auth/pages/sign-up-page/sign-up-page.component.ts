import {Component, QueryList, ViewChildren} from '@angular/core';
import {AuthLayoutComponent} from '../../layouts/auth-layout/auth-layout.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {AuthService} from '../../../firebase/services/auth.service';
import {Router} from '@angular/router';
import {passwordValidator} from '../../../../../validators';
import {clearFormErrors, setFormErrors} from '../../../../../control-forms';
import {ErrorableDirective} from '../../../../shared/directives/errorable/errorable.directive';

// Password validator constants
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MIN_UPPERCASE = 1;
const PASSWORD_MIN_NUMERIC = 1;
const PASSWORD_MIN_LOWERCASE = 1;
const PASSWORD_MIN_SPECIAL = 1;
const passwordValidatorFn = passwordValidator(PASSWORD_MIN_LENGTH, PASSWORD_MIN_UPPERCASE, PASSWORD_MIN_LOWERCASE, PASSWORD_MIN_NUMERIC, PASSWORD_MIN_SPECIAL);

@Component({
  selector: 'app-auth-sign-up-page',
  imports: [
    AuthLayoutComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up-page.component.html',
  standalone: true,
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  @ViewChildren(ErrorableDirective) errorableComponents!: QueryList<ErrorableDirective>;
  title: string = 'Sign Up';
  link: string = '/sign-in';
  linkText: string = 'Already have an account? Sign in';
  authForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    'first-name': new FormControl<string>('', [Validators.required]),
    'last-name': new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, passwordValidatorFn]),
    'confirm-password': new FormControl<string>('', [Validators.required])
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  // Submit Handler Click
  async submitHandler(): Promise<void> {
    if (this.authForm?.valid) {
      // Clear previous errors
      clearFormErrors(this.errorableComponents);

      // Get the form values
      const {
        "first-name": firstName,
        "last-name": lastName,
        email,
        "confirm-password": confirmPassword,
        password
      } = this.authForm.value;

      // Get the password and confirm password values
      const passwordInput = this.errorableComponents.find(errorableComponent => errorableComponent.id === 'password') as InputComponent;
      const confirmPasswordInput = this.errorableComponents.find(errorableComponent => errorableComponent.id === 'confirm-password') as InputComponent;

      // Check if password and confirm password match
      if (password !== confirmPassword) {
        for (let errorableComponent of [passwordInput, confirmPasswordInput])
          errorableComponent.error = 'Passwords do not match';
        return
      }

      try {
        await this.authService.signUp(firstName as string, lastName as string, email as string, password as string)
        this.router.navigateByUrl('/', {skipLocationChange: false, replaceUrl: true})
      } catch (error: any) {
        // Check if the error is about the email already in use
        if (error?.code === 'auth/email-already-in-use') {
          this.errorableComponents.forEach(errorableComponent => {
            if (errorableComponent.id === 'email')
              errorableComponent.error = 'Email already in use';
          })
          return
        }
        console.error(error)
      }
    } else {
      console.log('Invalid form', this.authForm)
      setFormErrors(this.errorableComponents, this.authForm)
    }
  }

  // Handle Reset Click
  resetHandler(): void {
    clearFormErrors(this.errorableComponents);
  }
}
