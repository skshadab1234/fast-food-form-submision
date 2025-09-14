import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material'
import { useRef } from 'react'

export default function PaymentSection ({
  paymentMode,
  setPaymentMode,
  txnId,
  setTxnId,
  screenshot,
  setScreenshot
}: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setScreenshot(file)
    }
  }

  return (
    <Box mt={3}>
      {/* Payment Mode Select */}
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

      {/* Online Payment Section */}
      {paymentMode === 'Online' && (
        <Box
          p={2}
          mt={2}
          border='1px solid'
          borderColor='primary.main'
          borderRadius={2}
          display='flex'
          flexDirection='column'
          gap={2}
        >
          <Typography variant='subtitle1' fontWeight='bold' color='primary'>
            💳 Online Payment Instructions
          </Typography>

          <Typography variant='body2'>
            Send payment to UPI: <b>fastfood@upi</b>
          </Typography>

          {/* Transaction ID Input */}
          <TextField
            label='Transaction ID'
            value={txnId}
            onChange={e => setTxnId(e.target.value)}
            fullWidth
          />

          {/* OR Divider */}
          <Typography align='center' color='text.secondary'>
            — OR —
          </Typography>

          {/* Screenshot Upload */}
          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <Button
            variant='outlined'
            onClick={() => fileInputRef.current?.click()}
          >
            {screenshot
              ? '✅ Screenshot Uploaded'
              : 'Upload Payment Screenshot'}
          </Button>

          {/* Hint */}
          <Typography variant='caption' color='error'>
            * Either Transaction ID or Screenshot is required
          </Typography>
        </Box>
      )}
    </Box>
  )
}
