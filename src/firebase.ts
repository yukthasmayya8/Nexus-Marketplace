import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Connection test as required by integration instructions
async function testConnection() {
  try {
    // Attempting to get a non-existent doc to trigger a server check
    await getDocFromServer(doc(db, '_internal', 'connection-test'));
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}
testConnection();
