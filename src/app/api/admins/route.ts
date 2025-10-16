
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("TempleConnect");
    const adminEmail = '24uad261vijesh@kgkite.ac.in';

    await db.collection('admins').updateOne(
      { email: adminEmail },
      { $set: { email: adminEmail, role: 'admin' } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Admin user added to the database.' });
  } catch (error) {
    console.error("Error adding admin user: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
