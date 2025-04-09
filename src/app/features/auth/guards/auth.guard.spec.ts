import {TestBed} from '@angular/core/testing';
import {CanActivateFn, Router} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AuthService} from '../services/auth/auth.service';

describe('AuthGuard', () => {
  let router: Router;
  let authService: AuthService;

  const executeGuard: CanActivateFn = () => {
    const guard = new AuthGuard(router, authService);
    return TestBed.runInInjectionContext(() => guard.canActivate());
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl'])},
        {provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['isAuthenticated'])}
      ]
    });
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
