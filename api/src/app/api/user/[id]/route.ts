import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });
}

