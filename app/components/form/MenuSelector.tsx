import { Autocomplete, TextField, Box, Typography, Button } from '@mui/material'

export default function MenuSelector ({
  menu,
  selectedItem,
  setSelectedItem,
  quantity,
  setQuantity,
  handleAddItem,
  formatCurrency
}: any) {
  // Flatten menu items with category info
  const options = menu.flatMap((category: any) =>
    category.items.map((item: any) => ({ ...item, category: category.label }))
  )

  return (
    <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
      <Autocomplete
        options={options}
        groupBy={option => option.category}
        getOptionLabel={option => option.name}
        value={selectedItem}
        onChange={(_, newValue) => setSelectedItem(newValue)}
        renderInput={params => <TextField {...params} label='Search Item' />}
        className='w-full'
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
            <div className='flex flex-col'>
              <Typography className='text-xs'>{option.name}</Typography>
              <Typography fontWeight='bold' className='text-xs'>
                {formatCurrency(option.price)}
              </Typography>
            </div>
          </Box>
        )}
      />

      <TextField
        label='Qty'
        type='number'
        value={quantity}
        onChange={e => {
          const val = Number(e.target.value)
          if (val > 0 && val <= 10) setQuantity(val)
        }}
        sx={{ width: { xs: '100%', sm: 100 } }}
      />

      <Button
        variant='contained'
        color='secondary'
        onClick={handleAddItem}
        disabled={!selectedItem}
      >
        Add
      </Button>
    </Box>
  )
}
