import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../firebase/services/auth.service';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {LinkComponent} from '../../../../shared/components/link/link.component';
import {LOGO_HEIGHT, LOGO_WIDTH} from '../../../../../constants';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-layout',
  imports: [
    NgIf,
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

  constructor(private authService: AuthService, private router: Router) {}

  // On init handler
  async ngOnInit(): Promise<void> {
    // Subscribe to the auth state changes
    this.authService.authStateChange.subscribe(async (value) => {
      await this.updateAuthLinks(value as boolean);
    });
  }

  // Update the visibility of the auth links and sign out button
  async updateAuthLinks(isAuthenticated: boolean): Promise<void> {
    this.isAuthenticated = isAuthenticated;
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
    this.router.navigate(['/my-cart'], {skipLocationChange: false, replaceUrl: true});
  }
}
