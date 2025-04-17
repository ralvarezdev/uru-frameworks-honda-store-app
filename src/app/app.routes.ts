import {Routes} from '@angular/router';
import {SignInPageComponent} from './features/auth/pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './features/auth/pages/sign-up-page/sign-up-page.component';
import {NotFoundPageComponent} from './shared/pages/not-found-page/not-found-page.component';
import {NotAuthGuard} from './features/auth/guards/not-auth.guard';
import {LandingPageComponent} from './features/store/pages/landing-page/landing-page.component';
import {MyProductsPageComponent} from './features/store/pages/my-products/my-products-page.component';
import {CatalogPageComponent} from './features/store/pages/catalog/catalog-page.component';
import {AuthGuard} from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {path: '', component: LandingPageComponent, pathMatch: 'full'},
  {path: 'sign-in', component: SignInPageComponent, canActivate: [NotAuthGuard]},
  {path: 'sign-up', component: SignUpPageComponent, canActivate: [NotAuthGuard]},
  {path: 'my-products', component: MyProductsPageComponent, canActivate: [AuthGuard]},
  {path: 'catalog', component: CatalogPageComponent},
  {path: '**', component: NotFoundPageComponent},
];
