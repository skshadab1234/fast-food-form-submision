'use client'

import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const DownloadRecord = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    if (password !== 'admin1@123') {
      alert('Invalid password')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/download-orders')
      const data = await res.json()

      if (!data || data.length === 0) {
        alert('No orders found')
        setLoading(false)
        return
      }

      // Convert 'items' arrays to string
      const formattedData = data.map((order: any) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items.join(', ') : order.items
      }))

      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, 'orders.xlsx')

      setLoading(false)
    } catch (error) {
      console.error('❌ Error:', error)
      alert('Failed to download Excel')
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Download Orders</h1>
      <div className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='p-2 border rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='p-2 border rounded'
        />
        <button
          onClick={handleDownload}
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Download Excel'}
        </button>
      </div>
    </div>
  )
}

export default DownloadRecord
