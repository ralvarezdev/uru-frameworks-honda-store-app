import {Injectable} from '@angular/core';
import {Auth, getAuth, GoogleAuthProvider} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../../../../../firebase.json';
import {getFunctions} from 'firebase/functions';
import {GCLOUD_REGION} from '../../../../constants';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  auth: Auth | null = null
  provider: GoogleAuthProvider | null = null
  functions: any | null = null

  constructor() {
    // Initialize Firebase
    initializeApp({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
      measurementId: firebaseConfig.measurementId,
    })

    // Get the Auth service
    this.auth = getAuth();

    // Google Sign-In
    this.provider = new GoogleAuthProvider();

    // Get the functions
    this.functions = getFunctions(undefined, GCLOUD_REGION)
  }
}
