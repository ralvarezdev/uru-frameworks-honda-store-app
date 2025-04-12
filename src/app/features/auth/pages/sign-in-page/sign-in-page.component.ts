import {Component, QueryList, ViewChildren} from '@angular/core';
import {AuthLayoutComponent} from '../../layouts/auth-layout/auth-layout.component';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../firebase/services/auth.service';
import {Router} from '@angular/router';
import {clearFormErrors, setFormControlErrors} from '../../../../../utils';

@Component({
  selector: 'app-auth-sign-in-page',
  imports: [
    AuthLayoutComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.css'
})
export class SignInPageComponent {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  title: string = 'Sign In';
  link: string = '/sign-up';
  linkText: string = 'Don\'t have an account? Sign up';
  authForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  // Handle Submit Click
  submitHandler(): void {
    if (this.authForm?.valid) {
      // Clear previous errors
      clearFormErrors(this.inputs);

      // Get the form values
      const {email, password} = this.authForm.value;


      this.authService.signIn(email as string, password as string).then(
        r =>
          this.router.navigateByUrl('/clocks/abacus', {skipLocationChange: false, replaceUrl: true})
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
