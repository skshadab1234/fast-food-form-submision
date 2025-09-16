import {
  Box,
  Typography,
  Divider,
  IconButton,
  Chip,
  useTheme
} from '@mui/material'
import { File, XIcon } from 'lucide-react'

export default function OrderSummary ({
  orders,
  handleRemove,
  totalAmount,
  formatCurrency
}: any) {
  const theme = useTheme()

  if (orders.length === 0) return null

  return (
    <Box mt={3}>
      <Typography
        variant='h6'
        gutterBottom
        className='flex gap-2 items-center'
        sx={{ color: theme.palette.text.primary }}
      >
        <File /> Order Summary
      </Typography>

      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      {orders.map((item: any) => (
        <Box
          key={item.id}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={1}
          p={1.2}
          sx={{
            bgcolor:
              theme.palette.mode === 'dark'
                ? theme.palette.grey[900]
                : theme.palette.grey[100],
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box>
            <Typography sx={{ color: theme.palette.text.primary }}>
              {item.name} × {item.quantity}
            </Typography>
            <Chip
              label={formatCurrency(item.total)}
              size='small'
              color='success'
              sx={{
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.success.dark
                    : theme.palette.success.light,
                color: theme.palette.success.contrastText,
                mt: 0.5
              }}
            />
          </Box>
          <IconButton color='error' onClick={() => handleRemove(item.id)}>
            <XIcon />
          </IconButton>
        </Box>
      ))}

      <Divider sx={{ mt: 2, mb: 2, borderColor: theme.palette.divider }} />

      <Typography
        variant='h6'
        fontWeight='bold'
        textAlign='right'
        sx={{ color: theme.palette.text.primary }}
      >
        Total: {formatCurrency(totalAmount)}
      </Typography>
    </Box>
  )
}
