import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all users
export async function GET() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true
        // password tidak di-include untuk keamanan
      },
    });
}
