import {Routes} from '@angular/router';
import {SignInPageComponent} from './features/auth/pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './features/auth/pages/sign-up-page/sign-up-page.component';
import {NotFoundPageComponent} from './shared/pages/not-found-page/not-found-page.component';
import {NotAuthGuard} from './features/auth/guards/not-auth.guard';
import {LandingPageComponent} from './features/store/pages/landing-page/landing-page.component';
import {MyProductsPageComponent} from './features/store/pages/my-products-page/my-products-page.component';
import {ProductsPageComponent} from './features/store/pages/products-page/products-page.component';
import {AuthGuard} from './features/auth/guards/auth.guard';
import {CartPageComponent} from './features/store/pages/cart-page/cart-page.component';
import {NewProductPageComponent} from './features/store/pages/new-product-page/new-product-page.component';
import {EditProductPageComponent} from './features/store/pages/edit-product-page/edit-product-page.component';
import {ProductPageComponent} from './features/store/pages/product-page/product-page.component';

export const routes: Routes = [
  {path: '', component: LandingPageComponent, pathMatch: 'full'},
  {path: 'sign-in', component: SignInPageComponent, canActivate: [NotAuthGuard]},
  {path: 'sign-up', component: SignUpPageComponent, canActivate: [NotAuthGuard]},
  {path: 'my-products', component: MyProductsPageComponent, canActivate: [AuthGuard]},
  {path: 'my-cart', component: CartPageComponent, canActivate: [AuthGuard]},
  {path: 'products', component: ProductsPageComponent},
  {path: 'new-product', component: NewProductPageComponent, canActivate: [AuthGuard]},
  {path: 'edit-product/:id', component: EditProductPageComponent, canActivate: [AuthGuard]},
  {path: 'product/:id', component: ProductPageComponent, canActivate:[AuthGuard]},
  {path: '**', component: NotFoundPageComponent},
];
