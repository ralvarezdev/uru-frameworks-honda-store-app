import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../firebase/services/auth.service';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {LinkComponent} from '../../../../shared/components/link/link.component';
import {LOGO_HEIGHT, LOGO_WIDTH} from '../../../../../constants';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-header-layout',
  imports: [
    NgIf,
    LinkComponent,
    NgOptimizedImage,
    SearchBarComponent,
    NgClass,
    ButtonComponent
  ],
  templateUrl: './header-layout.component.html',
  styleUrl: './header-layout.component.css'
})
export class HeaderLayoutComponent implements OnInit {
  title: string = 'Repuestos EDGE';
  showSignInLink: boolean = true;
  showSignUpLink: boolean = true;
  showSignOutButton: boolean = false;
  signInLink: string = '/sign-in';
  signUpLink: string = '/sign-up';
  signInText: string = 'Sign In';
  signUpText: string = 'Sign Up';
  signOutText: string = 'Sign Out';
  logoHeight: number = LOGO_HEIGHT;
  logoWidth: number = LOGO_WIDTH
  searchBarPlaceholder: string = 'Aceite Honda ATF DW-1...';

  constructor(private authService: AuthService) {}

  // On init handler
  ngOnInit(): void {
    // Subscribe to the auth state changes
    this.authService.authStateChange.subscribe(() => {
      this.updateAuthLinks();
    });

    // Initial update of auth links
    this.updateAuthLinks();
  }

  // Update the visibility of the auth links and sign out button
  updateAuthLinks(): void {
    if (this.authService.isAuthenticated) {
      this.showSignInLink = false;
      this.showSignUpLink = false;
      this.showSignOutButton = true;
    } else {
      this.showSignOutButton = false;
      this.showSignInLink = true;
      this.showSignUpLink = true;
    }
  }

  // Sign out handler
  async signOutHandler(): Promise<void> {
    await this.authService.signOut();
    this.updateAuthLinks();
  }
}
