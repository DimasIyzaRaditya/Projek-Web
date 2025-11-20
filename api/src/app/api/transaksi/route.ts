import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all transaksi
export async function GET() {
  try {
    const transaksi = await prisma.transaksi.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ data: transaksi });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transaksi" },
      { status: 500 }
    );
  }
}

// POST create new transaksi
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { userId, produkId, totalHarga } = body;
}
