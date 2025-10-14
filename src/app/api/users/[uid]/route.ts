
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';

const { adminDb, adminAuth } = initializeAdmin();

export async function PATCH(
  request: Request,
  { params }: { params: { uid: string } }
) {
  if (!adminDb || !adminAuth) {
    return NextResponse.json({ message: 'Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  const { uid } = params;
  const { disabled } = await request.json();

  if (typeof disabled !== 'boolean') {
    return NextResponse.json({ message: 'Invalid "disabled" value in request body.' }, { status: 400 });
  }

  try {
    // Update in Firestore
    await adminDb.collection('users').doc(uid).update({ disabled });
    // Update in Firebase Auth
    await adminAuth.updateUser(uid, { disabled });

    return NextResponse.json({ success: true, message: `User status updated successfully.` });
  } catch (error) {
    console.error("Error updating user status: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
