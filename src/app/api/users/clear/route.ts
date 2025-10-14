
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';

const { adminDb, adminAuth } = initializeAdmin();

export async function POST() {
  if (!adminDb || !adminAuth) {
    return NextResponse.json({ message: 'Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  try {
    // 1. Get all users from Firestore
    const usersSnapshot = await adminDb.collection('users').get();
    const uidsToDelete = usersSnapshot.docs.map(doc => doc.id);

    // 2. Delete all users from Firebase Authentication
    // Note: deleteUsers can handle up to 500 users at a time.
    // For larger user bases, this would need to be batched.
    if (uidsToDelete.length > 0) {
      await adminAuth.deleteUsers(uidsToDelete);
    }
    
    // 3. Delete all user documents from Firestore
    const batch = adminDb.batch();
    usersSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return NextResponse.json({ success: true, message: 'All user data has been cleared.' });
  } catch (error) {
    console.error("Error clearing all user data: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
