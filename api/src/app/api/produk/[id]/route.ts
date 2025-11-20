import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET produk by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const produk = await prisma.produk.findUnique({
      where: { id: parseInt(id) },
      include: {
        transaksi: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!produk) {
      return NextResponse.json(
        { error: 'Produk not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: produk });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch produk' },
      { status: 500 }
    );
  }
}

