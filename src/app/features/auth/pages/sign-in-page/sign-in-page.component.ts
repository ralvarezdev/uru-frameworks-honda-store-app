import {Component, QueryList, ViewChildren} from '@angular/core';
import {AuthLayoutComponent} from '../../layouts/auth-layout/auth-layout.component';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../firebase/services/auth.service';
import {Router} from '@angular/router';
import {clearFormErrors, setFormErrors} from '../../../../../control-forms';
import {ErrorableDirective} from '../../../../shared/directives/errorable/errorable.directive';

@Component({
  selector: 'app-auth-sign-in-page',
  imports: [
    AuthLayoutComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in-page.component.html',
  standalone: true,
  styleUrl: './sign-in-page.component.css'
})
export class SignInPageComponent {
  @ViewChildren(ErrorableDirective) errorableComponents!: QueryList<ErrorableDirective>;
  title: string = 'Sign In';
  link: string = '/sign-up';
  linkText: string = 'Don\'t have an account? Sign up';
  authForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  // Handle Submit Click
  async submitHandler(): Promise<void> {
    if (this.authForm?.valid) {
      // Clear previous errors
      clearFormErrors(this.errorableComponents);

      // Get the form values
      const {email, password} = this.authForm.value;

      try {
        await this.authService.signIn(email as string, password as string)
        this.router.navigateByUrl('/', {skipLocationChange: false, replaceUrl: true})
      } catch (error: any) {
        // Check if the error is about the user not found
        if (error?.code === 'auth/user-not-found') {
          this.errorableComponents.forEach(errorableComponent => {
            if (errorableComponent.id === 'email')
              errorableComponent.error = 'User not found';
          })
          return
        }

        // Check if the error is about the wrong password
        if (error?.code === 'auth/invalid-credential') {
          this.errorableComponents.forEach(errorableComponent => {
            if (errorableComponent.id === 'password')
              errorableComponent.error = 'Wrong password';
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
