import {Routes} from '@angular/router';
import {SignInPageComponent} from './features/auth/pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './features/auth/pages/sign-up-page/sign-up-page.component';
import {NotFoundPageComponent} from './shared/pages/not-found-page/not-found-page.component';
import {NotAuthGuard} from './features/auth/guards/not-auth.guard';
import {AuthGuard} from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {path: 'sign-in', component: SignInPageComponent, canActivate: [NotAuthGuard]},
  {path: 'sign-up', component: SignUpPageComponent, canActivate: [NotAuthGuard]},
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
  {path: '**', component: NotFoundPageComponent},
];
