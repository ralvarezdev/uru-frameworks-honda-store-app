import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../firebase/services/auth.service';
import {NgOptimizedImage} from '@angular/common';
import {LinkComponent} from '../../../../shared/components/link/link.component';
import {LOGO_HEIGHT, LOGO_WIDTH} from '../../../../../constants';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {Router} from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-header-layout',
  imports: [
    LinkComponent,
    NgOptimizedImage,
    SearchBarComponent,
    ButtonComponent
  ],
  templateUrl: './header-layout.component.html',
  standalone: true,
  styleUrl: './header-layout.component.css'
})
export class HeaderLayoutComponent implements OnInit {
  title: string = 'Repuestos EDGE';
  isAuthenticated: boolean = false;
  signInLink: string = '/sign-in';
  signUpLink: string = '/sign-up';
  signInText: string = 'Sign In';
  signUpText: string = 'Sign Up';
  signOutText: string = 'Sign Out';
  productsText: string = 'Products';
  cartText: string = 'Cart';
  logoHeight: number = LOGO_HEIGHT;
  logoWidth: number = LOGO_WIDTH;
  logoLink: string = '/';
  searchBarPlaceholder: string = 'Aceite Honda ATF DW-1...';
  @Input() searchBarValue: string = '';

  constructor(private authService: AuthService, private router: Router, private productsService: ProductsService) {
  }

  // On init handler
  async ngOnInit(): Promise<void> {
    // Subscribe to the auth state changes
    this.authService.authStateChange.subscribe(async (value) => {
      this.isAuthenticated = value as boolean;
    });
    this.searchBarValue = this.productsService.searchTerm;
  }

  // Sign out handler
  async signOutHandler(): Promise<void> {
    await this.authService.signOut();
  }

  // Products handler
  async productsHandler(): Promise<void> {
    this.router.navigate(['/my-products'], {skipLocationChange: false, replaceUrl: true});
  }

  // Cart handler
  async cartHandler(): Promise<void> {
    await this.router.navigate(['/my-cart'], {skipLocationChange: false, replaceUrl: true});
  }

  // On search click handler
  async searchClickHandler(title: string): Promise<void> {
    // Set limit and offset
    this.productsService.setLimit(10);
    this.productsService.setOffset(0);

    // Set the search term
    this.productsService.setSearchTerm(title);

    await this.router.navigate(['/products'], {skipLocationChange: false, replaceUrl: true});
  }
}
