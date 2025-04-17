import {Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {AppService} from './app.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth | null = null
  createUserCloudFn: any;
  getUserByIdCloudFn: any;
  private _isAuthenticated = new BehaviorSubject<boolean | null>(null);
  authStateChange = this._isAuthenticated.asObservable();

  constructor(private appService: AppService) {
    this.auth = appService.auth;

    // Check authentication state after Firebase is loaded
    onAuthStateChanged(this.auth as Auth, (user: any) => {
      this._isAuthenticated.next(!!user);
    });

    // Define the callable functions
    this.createUserCloudFn = this.appService.getFunction('create_user');
    this.getUserByIdCloudFn = this.appService.getFunction('get_user_by_id');
  }

  // Check if the user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authStateChange.subscribe((isAuthenticated) => {
        if (isAuthenticated === null)
          return

        resolve(isAuthenticated);
      });
    });
  }

  // Sign in with email/password
  async signUp(first_name: string, last_name: string, email: string, password: string) {
    // Create the user with email and password
    await createUserWithEmailAndPassword(this.auth as Auth, email, password)

    // Log the user in
    await this.signIn(email, password)

    // Create the user in the database
    await this.createUserCloudFn({first_name, last_name})

    // Log the user signed up
    console.log('User signed up: ', email)
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    // Sign in the user
    await signInWithEmailAndPassword(this.auth as Auth, email, password)

    // Log the user signed in
    console.log('User signed in: ', email)
  }

  // Sign out
  async signOut() {
    await signOut(this.auth as Auth)

    // Log the user signed out
    console.log('User signed out')
  }
}
