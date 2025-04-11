import {Component, QueryList, ViewChildren} from '@angular/core';
import {AuthLayoutComponent} from '../../layouts/auth-layout/auth-layout.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {AuthService} from '../../../firebase/services/auth.service';
import {Router} from '@angular/router';
import {clearFormErrors, setFormControlErrors} from '../../../../../utils';

@Component({
  selector: 'app-auth-sign-up-page',
  imports: [
    AuthLayoutComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  title: string = 'Sign Up';
  link: string = '/sign-in';
  linkText: string = 'Already have an account? Sign in';
  authForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    "first-name": new FormControl<string>('', [Validators.required]),
    "last-name": new FormControl<string>('', [Validators.required])
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  // Submit Handler Click
  submitHandler(): void {
    if (this.authForm?.valid) {
      const {"first-name": firstName, "last-name": lastName, email, password} = this.authForm.value;
      this.authService.signUp(firstName as string, lastName as string, email as string, password as string).then(
        r =>
          this.router.navigateByUrl('/sign-in', {skipLocationChange: false, replaceUrl: true})
      ).catch(error => {
        console.error(error)
      })
    } else {
      console.log('Invalid form', this.authForm)
      setFormControlErrors(this.inputs, this.authForm)
    }
  }

  // Handle Reset Click
  resetHandler(): void {
    clearFormErrors(this.inputs);
  }
}
