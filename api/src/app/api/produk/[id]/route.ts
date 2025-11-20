import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET produk by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {}

