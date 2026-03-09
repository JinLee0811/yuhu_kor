import { NextResponse } from 'next/server';
import { categories } from '@/lib/constants/categories';
import { ok } from '@/lib/api';

export async function GET() {
  return NextResponse.json(ok(categories));
}
