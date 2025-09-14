import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'

export async function POST (req: Request) {
  try {
    const form = await req.formData()

    const name = form.get('name') as string
    const phone = form.get('phone') as string
    const email = form.get('email') as string
    const address = form.get('address') as string
    const orders = JSON.parse(form.get('orders') as string)
    const totalAmount = parseFloat(form.get('totalAmount') as string)
    const paymentMode = form.get('paymentMode') as string
    const txnId = form.get('txnId') as string

    let screenshotPath: string | null = null
    let screenshotFileName: string | null = null

    const screenshot = form.get('screenshot') as File | null
    console.log(screenshot, 'screenshot')
    if (screenshot) {
      // Convert File to buffer safely on server
      const arrayBuffer =
        (await screenshot.arrayBuffer?.()) ||
        (await screenshot
          .stream()
          .getReader()
          .read()
          .then(r => r.value))
      const buffer = Buffer.from(arrayBuffer)

      const uploadDir = path.join(process.cwd(), 'app', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      const fileName = `${uuidv4()}-${screenshot.name}`
      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, buffer)

      screenshotPath = filePath
      screenshotFileName = screenshot.name
    }

    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`

    // ✅ Mail setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // ✅ Admin Mail
    const mailOptionsAdmin: any = {
      from: `"Fast Food Shop" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🍔 New Order Received - ${orderId}`,
      html: `
        <h3>New Order Received</h3>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Address:</b> ${address}</p>
        <p><b>Payment Mode:</b> ${paymentMode}</p>
        <p><b>Txn ID:</b> ${txnId || '-'}</p>
        <p><b>Items:</b><br/>${orders
          .map((i: any) => `${i.name} × ${i.quantity} — ₹${i.total}`)
          .join('<br/>')}</p>
        <p><b>Total:</b> ₹${totalAmount}</p>
      `,
      attachments: []
    }

    if (screenshotPath) {
      mailOptionsAdmin.attachments.push({
        filename: screenshotFileName || 'screenshot.jpg',
        path: screenshotPath
      })
    }

    await transporter.sendMail(mailOptionsAdmin)

    // ✅ Customer Mail
    await transporter.sendMail({
      from: `"Fast Food Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `✅ Order Confirmation - ${orderId}`,
      html: `
        <h3>Thank you, ${name}!</h3>
        <p>Your order has been placed successfully.</p>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Items:</b><br/>${orders
          .map((i: any) => `${i.name} × ${i.quantity} — ₹${i.total}`)
          .join('<br/>')}</p>
        <p><b>Total:</b> ₹${totalAmount}</p>
        <p>We will deliver your order soon 🚀</p>
      `
    })

    return NextResponse.json({
      success: true,
      orderId
    })
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
