import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { keyframes } from '@mui/system'

const messages = [
  'Validating Information',
  'Confirming Order',
  'Cooking',
  'Packing'
]

// Dot animation
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); } 
  40% { transform: scale(1); }
`

interface ZomatoLoaderProps {
  onFinish?: () => void // callback when loader finishes all steps
}

export default function ZomatoLoader ({ onFinish }: ZomatoLoaderProps) {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0)

  useEffect(() => {
    if (currentMsgIndex >= messages.length) {
      // Finished all steps
      onFinish?.()
      return
    }

    const timer = setTimeout(() => {
      setCurrentMsgIndex(prev => prev + 1)
    }, 1500) // 1.5 seconds per step

    return () => clearTimeout(timer)
  }, [currentMsgIndex, onFinish])

  if (currentMsgIndex >= messages.length) return null // hide loader when done

  return (
    <Box
      position='fixed'
      top={0}
      left={0}
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      bgcolor='rgba(255,255,255,0.95)'
      zIndex={2000}
    >
      <CircularProgress size={70} color='primary' />
      <Typography
        variant='h6'
        fontWeight='bold'
        color='primary'
        mt={3}
        display='flex'
        alignItems='center'
        gap={1}
      >
        {messages[currentMsgIndex]}
        <Box display='flex' gap={0.5}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <Box
              key={i}
              width={8}
              height={8}
              bgcolor='primary.main'
              borderRadius='50%'
              sx={{
                animation: `${bounce} 1.4s infinite ease-in-out`,
                animationDelay: `${delay}s`
              }}
            />
          ))}
        </Box>
      </Typography>
    </Box>
  )
}
