import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

try {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : undefined;

    if (serviceAccount) {
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "safdarbad-gymkhana",
      });
    }
  } else {
    app = getApps()[0];
  }

  if (app) {
    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
  }
} catch {
  // Gracefully handle build-time environments without GCP credentials
}

export { adminAuth, adminDb };
