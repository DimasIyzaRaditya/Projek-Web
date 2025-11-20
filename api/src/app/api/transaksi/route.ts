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

    if (!userId || !produkId || !totalHarga) {
      return NextResponse.json(
        { error: "userId, produkId, and totalHarga are required" },
        { status: 400 }
      );
    }

    if (typeof totalHarga !== "number" || totalHarga < 0) {
      return NextResponse.json(
        { error: "totalHarga must be a positive number" },
        { status: 400 }
      );
    }

    // Verify user and produk exist
    const [user, produk] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.produk.findUnique({ where: { id: produkId } }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}
