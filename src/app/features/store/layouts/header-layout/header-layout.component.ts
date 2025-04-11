import {Component} from '@angular/core';
import {AuthService} from '../../../firebase/services/auth.service';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {LinkComponent} from '../../../../shared/components/link/link.component';
import {LOGO_HEIGHT, LOGO_WIDTH} from '../../../../../constants';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-header-layout',
  imports: [
    NgIf,
    LinkComponent,
    NgOptimizedImage,
    SearchBarComponent,
    NgClass
  ],
  templateUrl: './header-layout.component.html',
  styleUrl: './header-layout.component.css'
})
export class HeaderLayoutComponent {
  title: string = 'Repuestos EDGE';
  showSignInLink: boolean = true;
  showSignUpLink: boolean = true;
  signInLink: string = '/sign-in';
  signInText: string = 'Sign In';
  signUpLink: string = '/sign-up';
  signUpText: string = 'Sign Up';
  logoHeight: number = LOGO_HEIGHT;
  logoWidth: number = LOGO_WIDTH
  searchBarPlaceholder: string = 'Aceite Honda ATF DW-1...';

  constructor(private authService: AuthService) {
    if (this.authService.isAuthenticated) {
      this.showSignInLink = false;
      this.showSignUpLink = false;
    }
  }

}
