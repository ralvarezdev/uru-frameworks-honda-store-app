import { Injectable } from '@angular/core';
import {Auth, getAuth, GoogleAuthProvider} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import firebase from '../../../../../firebase.json';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  auth: Auth|null = null
  provider: GoogleAuthProvider|null = null

  constructor() {
    // Initialize Firebase
    initializeApp({
      apiKey: firebase.apiKey,
      authDomain: firebase.authDomain,
      projectId: firebase.projectId,
      storageBucket: firebase.storageBucket,
      messagingSenderId: firebase.messagingSenderId,
      appId: firebase.appId,
      measurementId: firebase.measurementId,
    })

    // Get the Auth service
    this.auth = getAuth();

    // Google Sign-In
    this.provider = new GoogleAuthProvider();
  }
}
