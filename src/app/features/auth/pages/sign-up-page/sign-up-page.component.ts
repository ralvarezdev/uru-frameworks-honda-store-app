import {Component} from '@angular/core';
import {AuthLayoutComponent} from '../../layouts/auth-layout/auth-layout.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

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
  title: string = 'Sign Up';
  link: string = '/sign-in';
  linkText: string = 'Already have an account? Sign in';
  authForm=new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private router: Router, private authService: AuthService) {}

  // Submit Handler Click
  submitHandler(): void {
    if (this.authForm?.valid) {
      const { email, password } = this.authForm.value;
      this.authService.signUp(email as string, password as string).then(
        r=>
        this.router.navigateByUrl('/sign-in', { skipLocationChange: false, replaceUrl: true })
      ).catch(error => {
        console.error(error)
      })
    } else {
      console.error('Invalid form', this.authForm?.value)
    }
  }
}
