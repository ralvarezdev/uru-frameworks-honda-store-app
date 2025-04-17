import {Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import {AppService} from './app.service';
import {httpsCallable} from 'firebase/functions';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth | null = null
  fireCreateUser: any;
  fireGetUserById: any;
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  authStateChange = this._isAuthenticated.asObservable();

  constructor(private appService: AppService) {
    this.auth = appService.auth;

    // Check authentication state after Firebase is loaded
    onAuthStateChanged(this.auth as Auth, (user: any) => {
      this._isAuthenticated.next(!!user);
    });

    // Define the callable functions
    this.fireCreateUser = this.appService.getFunction('create_user');
    this.fireGetUserById = this.appService.getFunction('get_user_by_id');
  }

  // Check if the user is authenticated
  get isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  // Sign in with email/password
  async signUp(firstName: string, lastName: string, email: string, password: string) {
    // Create the user with email and password
    await createUserWithEmailAndPassword(this.auth as Auth, email, password)

    // Log the user in
    await this.signIn(email, password)

    // Create the user in the database
    await this.fireCreateUser({first_name: firstName, last_name: lastName})

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
