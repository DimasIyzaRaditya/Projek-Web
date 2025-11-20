import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET transaksi by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        produk: true,
      },
    });

    if (!transaksi) {
      return NextResponse.json(
        { error: 'Transaksi not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: transaksi });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transaksi' },
      { status: 500 }
    );
  }
}

// PUT update transaksi
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { userId, produkId, totalHarga } = body;

    const updateData: any = {};
    
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      updateData.userId = userId;
    }

    if (produkId) {
      const produk = await prisma.produk.findUnique({ where: { id: produkId } });
      if (!produk) {
        return NextResponse.json(
          { error: 'Produk not found' },
          { status: 404 }
        );
      }
      updateData.produkId = produkId;
    }

    if (totalHarga !== undefined) {
      if (typeof totalHarga !== 'number' || totalHarga < 0) {
        return NextResponse.json(
        );
      }
      updateData.totalHarga = totalHarga;
    }
}