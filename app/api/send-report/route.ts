import { NextResponse } from 'next/server'
import path from 'path'
import { readFile } from 'fs/promises'
import nodemailer from 'nodemailer'
import * as XLSX from 'xlsx'

export async function GET () {
  try {
    const ordersFilePath = path.join(process.cwd(), 'orders.json')

    // ✅ Read orders.json
    let orders: any[] = []
    try {
      const fileData = await readFile(ordersFilePath, 'utf-8')
      orders = JSON.parse(fileData)
    } catch {
      console.log('⚠️ No orders.json found or empty file')
      return NextResponse.json({ success: false, message: 'No orders found' })
    }

    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'No orders found' })
    }

    // ✅ Generate summary
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const topItems: Record<string, number> = {}
    orders.forEach(o => {
      o.items.forEach((item: string) => {
        const name = item.split('×')[0].trim()
        topItems[name] = (topItems[name] || 0) + 1
      })
    })

    const summaryHtml = `
      <h2>📊 Daily Order Report</h2>
      <p><b>Total Orders:</b> ${totalOrders}</p>
      <p><b>Total Revenue:</b> ₹${totalRevenue}</p>
      <h3>Top Items:</h3>
      <ul>
        ${Object.entries(topItems)
          .map(([name, qty]) => `<li>${name}: ${qty}</li>`)
          .join('')}
      </ul>
    `

    // ✅ Convert JSON → Excel
    const worksheet = XLSX.utils.json_to_sheet(orders)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer'
    })

    // ✅ Setup mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    await transporter.sendMail({
      from: `"MamuJaan" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '📊 Daily Orders Report',
      html: summaryHtml,
      attachments: [
        {
          filename: 'orders-report.xlsx',
          content: excelBuffer
        }
      ]
    })

    console.log('✅ Daily report sent successfully')
    return NextResponse.json({
      success: true,
      message: 'Report sent successfully',
      time: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('❌ Error in cron report:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
