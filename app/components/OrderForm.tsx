'use client'
import React, { useState } from 'react'
import { Container, Typography, Button, Divider, Box } from '@mui/material'
import { Send } from 'lucide-react'

import CustomerInfo from './form/CustomerInfo'
import MenuSelector from './form/MenuSelector'
import OrderSummary from './form/OrderSummary'
import PaymentSection from './form/PaymentSelection'
import Loader from './form/Loader'
import Swal from 'sweetalert2'
import Branding from './Branding'

// Dummy menu data (replace with DB/API later)
const menu = [
  {
    label: 'Momos',
    items: [
      { id: 'steamed_momos_s', name: 'Steamed Momos (Small)', price: 50 },
      { id: 'steamed_momos_l', name: 'Steamed Momos (Large)', price: 90 },
      { id: 'fried_momos_s', name: 'Fried Momos (Small)', price: 60 },
      { id: 'fried_momos_l', name: 'Fried Momos (Large)', price: 110 },
      { id: 'kurkure_momos_s', name: 'Kurkure Momos (Small)', price: 90 },
      { id: 'kurkure_momos_l', name: 'Kurkure Momos (Large)', price: 170 },
      { id: 'chilly_momos_s', name: 'Chilly Momos (Small)', price: 90 },
      { id: 'chilly_momos_l', name: 'Chilly Momos (Large)', price: 170 },
      { id: 'crispy_momos_s', name: 'Crispy Momos (Small)', price: 90 },
      { id: 'crispy_momos_l', name: 'Crispy Momos (Large)', price: 170 },
      { id: 'barra_momos', name: 'Barra Momos', price: 220 }
    ]
  },
  {
    label: 'Maggie',
    items: [
      { id: 'plain_maggie', name: 'Plain Maggie', price: 40 },
      { id: 'veg_maggie', name: 'Veg Maggie', price: 50 },
      { id: 'cheesy_maggie', name: 'Cheesy Maggie', price: 60 }
    ]
  },
  {
    label: 'Fries',
    items: [
      { id: 'french_fries', name: 'French Fries', price: 70 },
      { id: 'peri_peri_fries', name: 'Peri-peri Fries', price: 90 },
      { id: 'cheesy_fries', name: 'Cheesy Fries', price: 110 }
    ]
  },
  {
    label: 'Burgers',
    items: [
      { id: 'chicken_burger', name: 'Chicken Burger', price: 60 },
      { id: 'maharaja_burger', name: 'Maharaja Burger', price: 110 }
    ]
  },
  {
    label: 'Shawarma',
    items: [
      { id: 'chicken_shawarma', name: 'Chicken Shawarma', price: 70 },
      { id: 'cheese_shawarma', name: 'Cheese Shawarma', price: 90 },
      { id: 'loaded_shawarma', name: 'Loaded Shawarma', price: 110 }
    ]
  },
  {
    label: 'Waffles',
    items: [
      { id: 'chocolate_waffle', name: 'Chocolate Waffle', price: 60 },
      { id: 'white_waffle', name: 'White Waffle', price: 60 },
      { id: 'nutella_waffle', name: 'Nutella Waffle', price: 80 }
    ]
  },
  {
    label: 'Chinese',
    items: [
      { id: 'chinese_bhel', name: 'Chinese Bhel', price: 20 },
      { id: 'chinese_manchurian', name: 'Chinese Manchurian', price: 20 },
      { id: 'cheesy_chinese_bhel', name: 'Cheesy Chinese Bhel', price: 40 }
    ]
  },
  {
    label: 'Chicken Lollipop Fry',
    items: [
      {
        id: 'lollipop_fry_250',
        name: 'Chicken Lollipop Fry 250gm (4 pcs)',
        price: 80
      },
      {
        id: 'lollipop_fry_500',
        name: 'Chicken Lollipop Fry 500gm (8 pcs)',
        price: 160
      },
      {
        id: 'lollipop_fry_1kg',
        name: 'Chicken Lollipop Fry 1kg (16 pcs)',
        price: 320
      }
    ]
  },
  {
    label: "Creamy Chicken Lollipop (Chef's Special)",
    items: [
      {
        id: 'creamy_lollipop_250',
        name: 'Creamy Chicken Lollipop 250gm',
        price: 150
      },
      {
        id: 'creamy_lollipop_500',
        name: 'Creamy Chicken Lollipop 500gm',
        price: 300
      },
      {
        id: 'creamy_lollipop_1kg',
        name: 'Creamy Chicken Lollipop 1kg',
        price: 550
      }
    ]
  },
  {
    label: 'Chicken Lollipop Chilly Dry',
    items: [
      {
        id: 'chilly_lollipop_250',
        name: 'Chicken Lollipop Chilly Dry 250gm',
        price: 150
      },
      {
        id: 'chilly_lollipop_500',
        name: 'Chicken Lollipop Chilly Dry 500gm',
        price: 300
      },
      {
        id: 'chilly_lollipop_1kg',
        name: 'Chicken Lollipop Chilly Dry 1kg',
        price: 550
      }
    ]
  }
]

export default function OrderForm () {
  // Customer states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  // Menu & orders
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [orders, setOrders] = useState<any[]>([])

  // Payment
  const [paymentMode, setPaymentMode] = useState('COD')
  const [txnId, setTxnId] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)

  // Loader
  const [loading, setLoading] = useState(false)

  // Validation regex
  const nameRegex = /^[A-Za-z ]{2,30}$/
  const phoneRegex = /^[0-9]{10,15}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Format currency
  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`

  // Add item
  const handleAddItem = () => {
    if (!selectedItem) return
    const existing = orders.find(o => o.id === selectedItem.id)
    if (existing) {
      existing.quantity += quantity
      existing.total = existing.quantity * existing.price
      setOrders([...orders])
    } else {
      setOrders([
        ...orders,
        {
          ...selectedItem,
          quantity,
          total: selectedItem.price * quantity
        }
      ])
    }
    setSelectedItem(null)
    setQuantity(1)
  }

  // Remove item
  const handleRemove = (id: number) => {
    setOrders(orders.filter(o => o.id !== id))
  }

  const totalAmount = orders.reduce((sum, o) => sum + o.total, 0)

  // Submit order
  const handleSubmit = async () => {
    // ✅ Basic Validations
    if (
      !nameRegex.test(name) ||
      !phoneRegex.test(phone) ||
      !emailRegex.test(email) ||
      !address
    ) {
      Swal.fire({
        icon: 'error',
        title: '❌ Invalid Details',
        text: 'Please fill all details correctly!'
      })
      return
    }

    if (orders.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '❌ No Items',
        text: 'Please add at least one item to your order.'
      })
      return
    }

    if (paymentMode === 'Online' && !txnId.trim() && !screenshot) {
      Swal.fire({
        icon: 'warning',
        title: 'Payment Info Missing',
        text: 'Please provide either Transaction ID or Screenshot for Online Payment.'
      })
      return
    }

    setLoading(true)

    try {
      // ✅ Prepare form data
      const formData = new FormData()
      formData.append('name', name)
      formData.append('phone', phone)
      formData.append('email', email)
      formData.append('address', address)
      formData.append('orders', JSON.stringify(orders))
      formData.append('totalAmount', totalAmount.toString())
      formData.append('paymentMode', paymentMode)
      formData.append('txnId', txnId)

      if (screenshot) formData.append('screenshot', screenshot)

      // ✅ Send to backend
      const res = await fetch('/api/order', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.success) {
        // ✅ Show SweetAlert with dynamic order details
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully! ✅',
          html: `
            <p><b>Hi ${name}, your order is now being packed! 🍔🚀</b></p>
            <p><b>Items Ordered:</b></p>
            <ul>
              ${orders
                .map(o => `<li>${o.name} × ${o.quantity} — ₹${o.total}</li>`)
                .join('')}
            </ul>
            <p><b>Total Amount:</b> ₹${totalAmount}</p>
            <p>Payment Mode: ${paymentMode}${
            paymentMode === 'Online'
              ? ` (Txn ID: ${txnId || 'Provided via Screenshot'})`
              : ''
          }</p>
            <p>We will deliver your order soon!</p>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Confirm'
        })

        // ✅ Reset form
        setName('')
        setPhone('')
        setEmail('')
        setAddress('')
        setOrders([])
        setPaymentMode('COD')
        setTxnId('')
        setScreenshot(null)
      } else {
        Swal.fire({
          icon: 'error',
          title: '❌ Error',
          text: data.error || 'Something went wrong while placing your order.'
        })
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: '⚠ Error',
        text: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading && <Loader onFinish={() => setLoading(false)} />}

      <Branding />

      {/* Customer Info */}
      <CustomerInfo
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        email={email}
        setEmail={setEmail}
        address={address}
        setAddress={setAddress}
        nameRegex={nameRegex}
        phoneRegex={phoneRegex}
        emailRegex={emailRegex}
      />

      <Divider sx={{ my: 3 }} />

      {/* Menu Selector */}
      <MenuSelector
        menu={menu}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddItem={handleAddItem}
        formatCurrency={formatCurrency}
      />

      {/* Order Summary */}
      <OrderSummary
        orders={orders}
        handleRemove={handleRemove}
        totalAmount={totalAmount}
        formatCurrency={formatCurrency}
      />

      <Divider sx={{ my: 3 }} />

      {/* Payment Section */}
      <PaymentSection
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        txnId={txnId}
        setTxnId={setTxnId}
        screenshot={screenshot}
        setScreenshot={setScreenshot}
      />

      <Box textAlign='center' mt={4}>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={handleSubmit}
          startIcon={<Send />}
          fullWidth
          className='!h-12'
          disabled={loading}
        >
          Place Order
        </Button>
      </Box>
    </div>
  )
}
