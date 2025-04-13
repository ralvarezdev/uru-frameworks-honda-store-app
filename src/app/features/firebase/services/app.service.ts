import {Injectable} from '@angular/core';
import {Auth, getAuth, GoogleAuthProvider, connectAuthEmulator} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../../../../../firebase.json';
import {getFunctions, connectFunctionsEmulator} from 'firebase/functions';
import {
  EMULATOR_ACTIVE,
  EMULATOR_AUTHENTICATION_URL, EMULATOR_FUNCTIONS_HOST, EMULATOR_FUNCTIONS_PORT,
  GCLOUD_REGION
} from '../../../../constants';
import {getApp} from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  app: any = null
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
    this.app = getApp()

    // Get the Auth service
    this.auth = getAuth(this.app);

    // Google Sign-In
    this.provider = new GoogleAuthProvider();

    // Get the functions
    this.functions = getFunctions(this.app, GCLOUD_REGION)

    // Check if the emulator is activated
    if (EMULATOR_ACTIVE){
      connectAuthEmulator(this.auth, EMULATOR_AUTHENTICATION_URL)
      connectFunctionsEmulator(this.functions, EMULATOR_FUNCTIONS_HOST, EMULATOR_FUNCTIONS_PORT)
    }
  }
}
