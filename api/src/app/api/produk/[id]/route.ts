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

// PUT update produk
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, harga } = body;

    const updateData: { nama?: string; harga?: number } = {};
    if (nama) updateData.nama = nama;
    if (harga !== undefined) {
      if (typeof harga !== 'number' || harga < 0) {
        return NextResponse.json(
          { error: 'Harga must be a positive number' },
          { status: 400 }
        );
      }
      updateData.harga = harga;
    }

    const produk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ data: produk });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produk not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update produk' },
      { status: 500 }
    );
  }
}

// DELETE produk
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.produk.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Produk deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produk not found' },
        { status: 404 }
      );
    }
    if (err.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete produk with existing transactions' },
        { status: 409 }
      );
    }
    return NextResponse.json(
    );
  }
}
