
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Create new user
    const newUser = {
      _id: uuidv4(),
      email,
      password, // In a real app, you MUST hash the password
      role,
    };

    await db.collection('users').insertOne(newUser);

    // Return the new user object (excluding password)
    const userForClient = {
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json(userForClient, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
