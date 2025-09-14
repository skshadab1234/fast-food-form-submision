import { Box, Typography, Divider, IconButton, Chip } from '@mui/material'
import { File, XIcon } from 'lucide-react'

export default function OrderSummary ({
  orders,
  handleRemove,
  totalAmount,
  formatCurrency
}: any) {
  if (orders.length === 0) return null
  return (
    <Box mt={3}>
      <Typography variant='h6' gutterBottom className='flex gap-2 items-center'>
        <File /> Order Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {orders.map((item: any) => (
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
              label={formatCurrency(item.total)}
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
  )
}
