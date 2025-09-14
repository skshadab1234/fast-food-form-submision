'use client'
import React, { useState } from 'react'
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Skeleton,
  Grid
} from '@mui/material'
import { File, Paperclip, ShoppingBag, XIcon } from 'lucide-react'

const menu = [
  { id: 'shawarma', name: 'Shawarma', price: 120 },
  { id: 'chicken_roll', name: 'Chicken Roll', price: 80 },
  { id: 'paneer_roll', name: 'Paneer Roll', price: 100 },
  { id: 'burger', name: 'Burger', price: 90 },
  { id: 'fries', name: 'French Fries', price: 70 },
  { id: 'coke', name: 'Coke (500ml)', price: 40 }
]

export default function OrderForm () {
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [orders, setOrders] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMode, setPaymentMode] = useState('COD')
  const [txnId, setTxnId] = useState('')
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [address, setAddress] = useState('')

  // ✅ Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[0-9]{10,15}$/
  const nameRegex = /^[A-Za-z\s]{2,30}$/

  const handleAddItem = () => {
    if (selectedItem && quantity > 0) {
      setAdding(true)
      setTimeout(() => {
        const existing = orders.find(o => o.id === selectedItem.id)
        if (existing) {
          setOrders(prev =>
            prev.map(o =>
              o.id === selectedItem.id
                ? {
                    ...o,
                    quantity: o.quantity + quantity,
                    total: o.price * (o.quantity + quantity)
                  }
                : o
            )
          )
        } else {
          setOrders(prev => [
            ...prev,
            { ...selectedItem, quantity, total: selectedItem.price * quantity }
          ])
        }
        setSelectedItem(null)
        setQuantity(1)
        setAdding(false)
      }, 700)
    }
  }

  const handleRemove = (id: string) => {
    setOrders(prev => prev.filter(item => item.id !== id))
  }

  const totalAmount = orders.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Validation checks
    if (!nameRegex.test(name)) {
      alert('⚠️ Please enter a valid name (letters only, min 2 chars).')
      return
    }
    if (!phoneRegex.test(phone)) {
      alert('⚠️ Please enter a valid phone number (10–15 digits).')
      return
    }
    if (!emailRegex.test(email)) {
      alert('⚠️ Please enter a valid email address.')
      return
    }
    if (paymentMode === 'Online' && !txnId.trim()) {
      alert('⚠️ Please enter Transaction ID for online payment.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const orderData = {
        name,
        phone,
        email,
        orders,
        total: totalAmount,
        paymentMode,
        txnId,
        instructions,
        address
      }
      console.log('📩 Order Submitted:', orderData)

      // call /api/order
      fetch(`/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
        .then(res => res.json())
        .then(data => {
          console.log('Order placed successfully:', data)
        })
        .catch(error => {
          console.error('Error placing order:', error)
        })
      setOrders([])
      setName('')
      setPhone('')
      setEmail('')
      setPaymentMode('COD')
      setTxnId('')
      setInstructions('')
      setAddress('')
      setLoading(false)
    }, 1500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }
  return (
    <Paper
      elevation={4}
      sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 3, mt: 4 }}
    >
      {/* Fullscreen Loader */}
      {loading && (
        <Box
          position='fixed'
          top={0}
          left={0}
          width='100%'
          height='100%'
          display='flex'
          justifyContent='center'
          alignItems='center'
          bgcolor='rgba(255,255,255,0.8)'
          zIndex={2000}
        >
          <CircularProgress size={60} color='primary' />
        </Box>
      )}

      <Typography
        variant='h4'
        fontWeight='bold'
        mb={2}
        textAlign='center'
        color='primary'
      >
        🌯 Fast Food Shop — Order Form
      </Typography>
      <Typography
        variant='body2'
        textAlign='center'
        mb={3}
        color='text.secondary'
      >
        Search your favorite item, add quantity & place your order easily.
      </Typography>

      <Box
        component='form'
        onSubmit={handleSubmit}
        display='flex'
        flexDirection='column'
        gap={3}
      >
        {/* Customer Info in 2 Col Grid */}
        <div className='grid grid-cols-2 gap-4'>
          <TextField
            label='Customer Name'
            variant='outlined'
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            required
            error={name !== '' && !nameRegex.test(name)}
            helperText={
              name !== '' && !nameRegex.test(name)
                ? 'Only letters & spaces allowed (2–30 chars)'
                : ''
            }
          />
          <TextField
            label='Phone Number'
            type='tel'
            variant='outlined'
            fullWidth
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            error={phone !== '' && !phoneRegex.test(phone)}
            helperText={
              phone !== '' && !phoneRegex.test(phone)
                ? 'Enter valid phone (10–15 digits)'
                : ''
            }
          />
          <TextField
            label='Email Address'
            type='email'
            className='col-span-2'
            variant='outlined'
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            error={email !== '' && !emailRegex.test(email)}
            helperText={
              email !== '' && !emailRegex.test(email)
                ? 'Enter valid email (e.g. abc@gmail.com)'
                : ''
            }
          />
          <TextField
            label='Delivery Address'
            multiline
            rows={3}
            className='col-span-2'
            variant='outlined'
            fullWidth
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
            placeholder='Enter your local delivery address (e.g. Near City Mall, Thane)'
          />
        </div>

        {/* Item Selector */}
        <Box display='flex' gap={2} alignItems='center'>
          <Autocomplete
            options={menu}
            getOptionLabel={option => option.name}
            value={selectedItem}
            onChange={(_, newValue) => setSelectedItem(newValue)}
            renderInput={params => (
              <TextField {...params} label='Search Item' />
            )}
            renderOption={(props, option) => (
              <Box
                component='li'
                {...props}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <div className='flex justify-between w-full'>
                  <Typography>{option.name}</Typography>
                  <Typography color='text.secondary' fontWeight='bold'>
                    {formatCurrency(option.price)}
                  </Typography>
                </div>
              </Box>
            )}
            sx={{ flex: 1 }}
          />

          <TextField
            label='Qty'
            type='number'
            value={quantity}
            onChange={e => {
              // and more than 10
              if (Number(e.target.value) > 0 && Number(e.target.value) <= 10) {
                setQuantity(Number(e.target.value))
              }
            }}
            inputProps={{ min: 1 }}
            sx={{ width: 100 }}
          />

          <Button variant='contained' color='secondary' onClick={handleAddItem}>
            Add
          </Button>
        </Box>

        {/* Order Summary */}
        {adding ? (
          <Box mt={3}>
            <Skeleton variant='rectangular' height={60} sx={{ mb: 1 }} />
            <Skeleton variant='rectangular' height={60} sx={{ mb: 1 }} />
          </Box>
        ) : orders.length > 0 ? (
          <Box mt={3}>
            <Typography
              variant='h6'
              gutterBottom
              className='flex gap-2 items-center'
            >
              <File /> Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {orders.map(item => (
              <Box
                key={item.id}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={1}
                p={1.2}
                sx={{ bgcolor: 'grey.100', borderRadius: 2 }}
              >
                <Box>
                  <Typography>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Chip
                    label={`${formatCurrency(item.total)}`}
                    size='small'
                    color='success'
                  />
                </Box>
                <IconButton color='error' onClick={() => handleRemove(item.id)}>
                  <XIcon />
                </IconButton>
              </Box>
            ))}
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant='h6' fontWeight='bold' textAlign='right'>
              Total: {formatCurrency(totalAmount)}
            </Typography>
          </Box>
        ) : null}

        {orders?.length > 0 && (
          <TextField
            label='Special Instructions'
            multiline
            rows={3}
            placeholder='e.g. Spicy jada karna, extra cheese dalna...'
            variant='outlined'
            fullWidth
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
          />
        )}

        {/* Payment Mode */}
        <FormControl fullWidth>
          <InputLabel>Payment Mode</InputLabel>
          <Select
            value={paymentMode}
            label='Payment Mode'
            onChange={e => setPaymentMode(e.target.value)}
          >
            <MenuItem value='COD'>Cash on Delivery</MenuItem>
            <MenuItem value='Online'>Online Payment</MenuItem>
          </Select>
        </FormControl>

        {/* If Online selected */}
        {paymentMode === 'Online' && (
          <Box
            p={2}
            border='1px solid'
            borderColor='primary.main'
            borderRadius={2}
            bgcolor='blue.50'
          >
            <Typography variant='subtitle1' fontWeight='bold' color='primary'>
              💳 Online Payment Instructions:
            </Typography>
            <Typography variant='body2' mb={1}>
              Please send payment to UPI ID: <b>fastfood@upi</b>
            </Typography>
            <TextField
              label='Transaction ID'
              variant='outlined'
              fullWidth
              value={txnId}
              onChange={e => setTxnId(e.target.value)}
              required
            />
          </Box>
        )}

        {/* Submit */}
        <Button
          type='submit'
          variant='contained'
          disabled={orders.length === 0}
          size='large'
          className='flex gap-3 items-center h-12'
        >
          <ShoppingBag size={20} /> <span> Place Order</span>
        </Button>
      </Box>
    </Paper>
  )
}
