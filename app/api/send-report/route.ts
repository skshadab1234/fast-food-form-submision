import { NextResponse } from 'next/server'

export async function GET () {
  console.log('🕒 Cron job triggered at:', new Date().toISOString())

  // 👉 Your cleanup / backup / email sending logic here

  return NextResponse.json({ success: true, time: new Date().toISOString() })
}
