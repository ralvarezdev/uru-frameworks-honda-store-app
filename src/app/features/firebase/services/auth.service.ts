import {Injectable} from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, Auth} from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private appService: AppService) {
    this.auth = appService.auth;
  }

  // Check if the user is authenticated
  get isAuthenticated(): boolean {
    return this.auth?.currentUser !== null
  }

  // Sign in with email/password
  async signUp(email: string, password: string) {
    // Create the user with email and password
    await createUserWithEmailAndPassword(this.auth as Auth, email, password)

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
