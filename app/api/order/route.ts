import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST (req: Request) {
  try {
    const body = await req.json()
    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`
    const filePath = path.join(process.cwd(), 'orders.json')

    // 1️⃣ Read existing orders if file exists
    let orders: any[] = []
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8')
      orders = JSON.parse(fileData)
    }

    // 2️⃣ Prepare new order
    const newOrder = {
      orderId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      paymentMode: body.paymentMode,
      txnId: body.paymentMode === 'Online' ? body.txnId : '',
      items: body.orders.map(
        (i: any) => `${i.name} × ${i.quantity} — ₹${i.total}`
      ),
      total: body.total,
      date: new Date().toLocaleString()
    }

    // 3️⃣ Append new order and save JSON
    orders.push(newOrder)
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8')

    // 4️⃣ Mail setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // 5️⃣ Prepare mail for customer
    const mailOptionsCustomer = {
      from: `"Fast Food Shop" <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: `✅ Your Order Placed - ${orderId}`,
      html: `
        <h2>Thank you for your order, ${body.name}!</h2>
        <p>Your order ID is <b>${orderId}</b></p>
        <ul>
          ${body.orders
            .map((i: any) => `<li>${i.name} × ${i.quantity} — ₹${i.total}</li>`)
            .join('')}
        </ul>
        <p><b>Total:</b> ₹${body.total}</p>
        <p>Payment Mode: ${body.paymentMode}</p>
        ${
          body.paymentMode === 'Online'
            ? `<p><b>Transaction ID:</b> ${body.txnId}</p>`
            : ''
        }
        <p>We are preparing your order and will notify you once it’s ready!</p>
      `
    }

    // 6️⃣ Prepare mail for admin
    const mailOptionsAdmin = {
      from: `"Fast Food Shop" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // your admin email
      subject: `🌯 New Order Received - ${orderId}`,
      html: `
        <h2>New Order Received</h2>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Customer Name:</b> ${body.name}</p>
        <p><b>Phone:</b> ${body.phone}</p>
        <p><b>Email:</b> ${body.email}</p>
        <p><b>Address:</b> ${body.address}</p>
        <p><b>Payment Mode:</b> ${body.paymentMode}</p>
        ${
          body.paymentMode === 'Online'
            ? `<p><b>Txn ID:</b> ${body.txnId}</p>`
            : ''
        }
        <h3>🛒 Order Items</h3>
        <ul>
          ${body.orders
            .map((i: any) => `<li>${i.name} × ${i.quantity} — ₹${i.total}</li>`)
            .join('')}
        </ul>
        <p><b>Total:</b> ₹${body.total}</p>
      `
    }

    // 7️⃣ Send both emails
    await transporter.sendMail(mailOptionsCustomer)
    await transporter.sendMail(mailOptionsAdmin)

    return new Response(
      JSON.stringify({ success: true, message: 'JSON updated & mails sent!' }),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    )
  }
}
