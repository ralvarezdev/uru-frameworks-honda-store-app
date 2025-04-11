import {Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {AppService} from './app.service';
import {getFunctions, httpsCallable} from 'firebase/functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth | null = null
  fireCreateUser: any;
  fireGetUserById: any;

  constructor(private appService: AppService) {
    this.auth = appService.auth;

    // Get the functions instance from Firebase
    const functions = getFunctions();

    // Define the callable functions
    this.fireCreateUser = httpsCallable(functions, 'createUser');
    this.fireGetUserById = httpsCallable(functions, 'getUserById');
  }

  // Check if the user is authenticated
  get isAuthenticated(): boolean {
    return this.auth?.currentUser !== null
  }

  // Sign in with email/password
  async signUp(firstName: string, lastName: string, email: string, password: string) {
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(this.auth as Auth, email, password)

    // Get the user ID
    const userId = userCredential.user.uid

    // Create the user in the database
    await this.fireCreateUser({uid: userId, first_name: firstName, last_name: lastName})

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
