
import * as admin from 'firebase-admin';

// This is for server-side (Admin SDK) initialization
const serviceAccount = {
    "type": "service_account",
    "project_id": "studio-2441954507-47728",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
} as admin.ServiceAccount;


function initializeAdmin() {
  if (admin.apps.length > 0) {
    return {
      adminDb: admin.firestore(),
      adminAuth: admin.auth()
    }
  }

  // Check if the required environment variables are set
  if (!serviceAccount.private_key || !serviceAccount.client_email) {
    console.warn("Firebase Admin environment variables not set. Admin features will be disabled.");
    return { adminDb: null, adminAuth: null };
  }
  
  try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
     return {
      adminDb: admin.firestore(),
      adminAuth: admin.auth()
    }
  } catch (error) {
     console.error("Firebase Admin Initialization Error:", error);
     return { adminDb: null, adminAuth: null };
  }
}

export { initializeAdmin };
