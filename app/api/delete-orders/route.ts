import { NextResponse } from 'next/server'
import path from 'path'
import { unlink } from 'fs/promises'

export async function GET (req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const pass = searchParams.get('pass')

    // ✅ Check password first
    if (pass !== 'admin1@123') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid password' },
        { status: 401 }
      )
    }

    const tmpOrdersPath = path.join('/tmp', 'orders.json')

    await unlink(tmpOrdersPath)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
