import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(
    {
      scope: 'local-bootstrap',
      status: 'ok',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
