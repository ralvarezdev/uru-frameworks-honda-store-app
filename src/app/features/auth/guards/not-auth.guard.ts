import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

  async canActivate(): Promise<boolean> {
    if (!this.authService.isAuthenticated) {
      console.log('User is not authenticated');
      return true; // Allow navigation
    } else {
      console.log('User is authenticated');
      await this.router.navigate(['/clocks/abacus'], {skipLocationChange: false, replaceUrl: true});
      return false; // Block navigation
    }
  }
}
