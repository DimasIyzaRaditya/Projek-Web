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
    return NextResponse.json({ data: produk });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch produk' },
      { status: 500 }
    );
  }
}

// POST create new produk
export async function POST(request: NextRequest) {

}
