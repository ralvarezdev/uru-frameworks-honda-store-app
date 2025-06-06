import {Injectable} from '@angular/core';
import {Auth, connectAuthEmulator, getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../../../../firebase.json';
import cloudFunctionsConfig from '../../../../../cloudFunctions.json';
import {connectFunctionsEmulator, getFunctions, httpsCallable} from 'firebase/functions';
import {
  EMULATOR_ACTIVE,
  EMULATOR_AUTHENTICATION_URL,
  EMULATOR_FUNCTIONS_HOST,
  EMULATOR_FUNCTIONS_PORT,
  GCLOUD_REGION
} from '../../../../constants';
import {sprintf} from "sprintf-js";
import {FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  app: any = null
  auth: Auth | null = null
  storage: FirebaseStorage | null = null
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

    // Get the Storage service
    this.storage = getStorage(this.app);

    // Google Sign-In
    this.provider = new GoogleAuthProvider();

    // Get the functions
    this.functions = getFunctions(this.app, GCLOUD_REGION)

    // Check if the emulator is activated
    if (EMULATOR_ACTIVE) {
      connectAuthEmulator(this.auth, EMULATOR_AUTHENTICATION_URL)
      connectFunctionsEmulator(this.functions, EMULATOR_FUNCTIONS_HOST, EMULATOR_FUNCTIONS_PORT)
    }
  }

  // Get function
  getFunction(name: string) {
    if (EMULATOR_ACTIVE)
      return httpsCallable(this.functions, name)

    // Format function name
    const formattedName = name.replace(/_/g, '-')

    // Get the formatted URL
    const formattedUrl = sprintf(cloudFunctionsConfig.url, formattedName)

    return async (body: any) => {
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

  // Upload image
  async uploadImage(selectedFile: Blob): Promise<string | void> {
    if (!selectedFile) {
      console.error('No file selected');
      return
    }

    // Create a unique file path
    const filePath = `images/${uuid()}`;
    const storageRef = ref(this.storage as FirebaseStorage, filePath);

    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, selectedFile);

      // Get the download URL
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}
