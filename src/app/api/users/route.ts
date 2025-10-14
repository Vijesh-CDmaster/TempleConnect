
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';
import type { AppUser } from '@/lib/user-service';

const { adminDb } = initializeAdmin();

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ message: 'Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  try {
    const usersSnapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: data.uid,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt,
        disabled: data.disabled || false,
      } as AppUser;
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
