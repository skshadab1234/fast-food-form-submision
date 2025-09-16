import { NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
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

    let screenshotPathTmp: string | null = null
    let screenshotPathRoot: string | null = null
    let screenshotFileName: string | null = null

    const screenshot = form.get('screenshot') as File | null
    if (screenshot) {
      const arrayBuffer =
        (await screenshot.arrayBuffer?.()) ||
        (await screenshot
          .stream()
          .getReader()
          .read()
          .then(r => r.value))
      const buffer = Buffer.from(arrayBuffer)

      // ✅ Save screenshot in /tmp (serverless safe)
      const tmpUploadDir = path.join('/tmp', 'uploads')
      await mkdir(tmpUploadDir, { recursive: true })
      const tmpFileName = `${uuidv4()}-${screenshot.name}`
      screenshotPathTmp = path.join(tmpUploadDir, tmpFileName)
      await writeFile(screenshotPathTmp, buffer)

      // ✅ Save screenshot in app/uploads (root/local) if writeable
      try {
        const rootUploadDir = path.join(process.cwd(), 'app', 'uploads')
        await mkdir(rootUploadDir, { recursive: true })
        const rootFileName = `${uuidv4()}-${screenshot.name}`
        screenshotPathRoot = path.join(rootUploadDir, rootFileName)
        await writeFile(screenshotPathRoot, buffer)
      } catch {
        console.warn('⚠️ Root upload not writeable (likely serverless)')
      }

      screenshotFileName = screenshot.name
    }

    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`

    // ✅ Paths for orders.json
    const tmpOrdersPath = path.join('/tmp', 'orders.json')
    const rootOrdersPath = path.join(process.cwd(), 'orders.json')

    // Read existing orders from tmp
    let existingOrders: any[] = []
    try {
      const fileData = await readFile(tmpOrdersPath, 'utf-8')
      existingOrders = JSON.parse(fileData)
    } catch {
      existingOrders = []
    }

    const newOrder = {
      orderId,
      name,
      phone,
      email,
      address,
      paymentMode,
      txnId: txnId || '-',
      items: orders.map((i: any) => `${i.name} × ${i.quantity} — ₹${i.total}`),
      total: totalAmount,
      date: new Date().toLocaleString('en-IN', { hour12: true })
    }

    existingOrders.push(newOrder)

    // ✅ Write orders.json to tmp (always safe)
    await writeFile(
      tmpOrdersPath,
      JSON.stringify(existingOrders, null, 2),
      'utf-8'
    )

    // ✅ Write orders.json to root/local if possible
    try {
      await writeFile(
        rootOrdersPath,
        JSON.stringify(existingOrders, null, 2),
        'utf-8'
      )
    } catch {
      console.warn('⚠️ Root orders.json not writeable (likely serverless)')
    }

    // ✅ Mail setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Admin Mail
    const mailOptionsAdmin: any = {
      from: `"MamuJaan" <${process.env.SMTP_USER}>`,
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

    if (screenshotPathTmp) {
      mailOptionsAdmin.attachments.push({
        filename: screenshotFileName || 'screenshot.jpg',
        path: screenshotPathTmp
      })
    }

    await transporter.sendMail(mailOptionsAdmin)

    // Customer Mail
    await transporter.sendMail({
      from: `"MamuJaan" <${process.env.SMTP_USER}>`,
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

    return NextResponse.json({ success: true, orderId })
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
