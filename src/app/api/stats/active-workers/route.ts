
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';

const { adminDb } = initializeAdmin();

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ count: 0 });
  }
  try {
    const snapshot = await adminDb.collection('users').where('role', '==', 'worker').where('disabled', '!=', true).get();
    return NextResponse.json({ count: snapshot.size });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}
