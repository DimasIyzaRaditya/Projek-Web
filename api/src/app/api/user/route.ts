import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        // password tidak di-include untuk keamanan
      },
    });
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, username, password } = body;

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'name, username, and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password, // Note: Hash password in production!
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });
}
