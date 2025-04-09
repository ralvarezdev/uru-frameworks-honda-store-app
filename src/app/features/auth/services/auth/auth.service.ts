import {Injectable} from '@angular/core';
import config from '../../../../../config';
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, Auth} from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth|null = null
  provider: GoogleAuthProvider|null = null

  constructor() {
    // Initialize Firebase
    initializeApp({
      apiKey: config.FIREBASE_API_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.FIREBASE_PROJECT_ID,
      storageBucket: config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
      appId: config.FIREBASE_APP_ID,
      measurementId: config.FIREBASE_MEASUREMENT_ID
    });

    // Get the Auth service
    this.auth = getAuth();

    // Google Sign-In
    this.provider = new GoogleAuthProvider();
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

  // Sign in with Google
  async signInWithGoogle() {
    // Sign in the user with Google
    await signInWithPopup(this.auth as Auth, this.provider as GoogleAuthProvider)

    // Log the user signed in
    console.log('User signed in with Google')
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
