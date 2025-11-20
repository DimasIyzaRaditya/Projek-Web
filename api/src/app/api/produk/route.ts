import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all produk
export async function GET() {
  try {
    const produk = await prisma.produk.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return NextResponse.json(produk);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch produk' },
      { status: 500 }
    );
  }
}

// POST create new produk
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, harga } = body;

    if (!nama || !harga) {
      return NextResponse.json(
        { error: 'Nama and harga are required' },
        { status: 400 }
      );
    }

    if (typeof harga !== 'number' || harga < 0) {
      return NextResponse.json(
        { error: 'Harga must be a positive number' },
        { status: 400 }
      );
    }

    const produk = await prisma.produk.create({
      data: {
        nama,
        harga,
      },
    });

    return NextResponse.json(produk, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create produk' },
      { status: 500 }
    );
  }
}
