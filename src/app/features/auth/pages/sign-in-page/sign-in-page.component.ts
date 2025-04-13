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
  async submitHandler(): Promise<void> {
    if (this.authForm?.valid) {
      // Clear previous errors
      clearFormErrors(this.inputs);

      // Get the form values
      const {email, password} = this.authForm.value;

      try{
        await this.authService.signIn(email as string, password as string)
        this.router.navigateByUrl('/', {skipLocationChange: false, replaceUrl: true})
      }catch(error: any) {
        // Check if the error is about the user not found
        if (error?.code === 'auth/user-not-found') {
          this.inputs.forEach(input => {
            if (input.id === 'email') {
              input.error = 'User not found';
              input.showError = true;
            }
          })
          return
        }

        // Check if the error is about the wrong password
        if (error?.code === 'auth/wrong-password') {
          this.inputs.forEach(input => {
            if (input.id === 'password') {
              input.error = 'Wrong password';
              input.showError = true;
            }
          })
          return
        }

        console.error(error)
      }
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
