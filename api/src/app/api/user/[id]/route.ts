import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        username: true,
        transaksi: {
          include: {
            produk: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' }
      { status: 500 }
    );
  }
}

