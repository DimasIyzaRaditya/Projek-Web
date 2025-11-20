import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all produk
export async function GET() {
    const produk = await prisma.produk.findMany({
    });
    return NextResponse.json({ data: produk });
}

