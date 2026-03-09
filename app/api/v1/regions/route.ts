import { NextResponse } from 'next/server';
import { regions } from '@/lib/constants/regions';
import { ok } from '@/lib/api';

export async function GET() {
  return NextResponse.json(ok(regions));
}
