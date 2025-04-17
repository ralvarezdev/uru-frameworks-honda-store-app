import {Injectable} from '@angular/core';
import {Auth, getAuth, GoogleAuthProvider, connectAuthEmulator} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../../../../../firebase.json';
import cloudFunctionsConfig from '../../../../../cloudFunctions.json';
import {getFunctions, connectFunctionsEmulator, httpsCallable} from 'firebase/functions';
import {
  EMULATOR_ACTIVE,
  EMULATOR_AUTHENTICATION_URL, EMULATOR_FUNCTIONS_HOST, EMULATOR_FUNCTIONS_PORT,
  GCLOUD_REGION
} from '../../../../constants';
import {getApp} from 'firebase/app';
import { sprintf } from "sprintf-js";

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

  // Get function
  getFunction(name: string) {
    if(EMULATOR_ACTIVE)
      return httpsCallable(this.functions, name)

    // Format function name
    const formattedName = name.replace(/_/g, '-')

    // Get the formatted URL
    const formattedUrl=sprintf(cloudFunctionsConfig.url, formattedName)

    return async (body:any) => {
      // Get the ID token
      const idToken = await this.auth?.currentUser?.getIdToken(true)

      return await fetch(formattedUrl, {
        method: 'POST',
        headers: {
          'Authorization': idToken ? `Bearer ${idToken}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
    }
  }
}
