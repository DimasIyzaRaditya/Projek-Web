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
  try {
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
          { error: 'totalHarga must be a positive number' },
          { status: 400 }
        );
      }
      updateData.totalHarga = totalHarga;
    }

    const transaksi = await prisma.transaksi.update({
      where: { id: parseInt(id) },
      data: updateData,
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

    return NextResponse.json({ data: transaksi });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Transaksi not found' },
        { status: 404 }
      );
    }
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid userId or produkId' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update transaksi' },
      { status: 500 }
    );
  }
}

// DELETE transaksi
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.transaksi.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Transaksi deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
      );
    }
  }
}
