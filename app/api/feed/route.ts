import { NextResponse } from 'next/server';
import { parseFeed } from '@/lib/parseFeed';

export async function GET() {
  try {
    const resources = await parseFeed();
    return NextResponse.json(resources, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to load feed' },
      { status: 500 }
    );
  }
}
