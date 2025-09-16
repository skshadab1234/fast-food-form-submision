'use client'

import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const DownloadRecord = () => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!password) {
      alert('⚠️ Please enter the password to proceed.')
      return
    }

    if (password !== 'admin1@123') {
      alert('❌ Invalid password. Please try again.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/download-orders')
      const data = await res.json()

      if (!data || data.length === 0) {
        alert('No orders found.')
        setLoading(false)
        return
      }

      // Format items array for Excel
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
      alert('Failed to download Excel file.')
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-xl p-8'>
        {/* Heading */}
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>
          Download Orders
        </h1>

        {/* Instructions */}
        <p className='text-gray-600 text-sm text-center mb-6'>
          Enter the admin password to securely download the order records in
          Excel format. <br /> Please keep this password safe.
        </p>

        {/* Password Form */}
        <div className='flex flex-col gap-4'>
          <input
            type='password'
            placeholder='Enter admin password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
          />

          <button
            onClick={handleDownload}
            disabled={loading}
            className={`flex justify-center items-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50`}
          >
            {loading && (
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                ></path>
              </svg>
            )}
            {loading ? 'Preparing Excel...' : 'Download Excel'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DownloadRecord
