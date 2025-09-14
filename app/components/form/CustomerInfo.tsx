import { TextField } from '@mui/material'

export default function CustomerInfo ({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  address,
  setAddress,
  nameRegex,
  phoneRegex,
  emailRegex
}: any) {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <TextField
        label='Customer Name'
        value={name}
        onChange={e => setName(e.target.value)}
        required
        error={name !== '' && !nameRegex.test(name)}
        helperText={
          name !== '' && !nameRegex.test(name)
            ? 'Only letters & spaces (2–30 chars)'
            : ''
        }
      />
      <TextField
        label='Phone Number'
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
        error={phone !== '' && !phoneRegex.test(phone)}
        helperText={
          phone !== '' && !phoneRegex.test(phone)
            ? 'Valid phone 10–15 digits'
            : ''
        }
      />
      <TextField
        label='Email Address'
        type='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className='col-span-2'
        required
        error={email !== '' && !emailRegex.test(email)}
        helperText={
          email !== '' && !emailRegex.test(email) ? 'Enter valid email' : ''
        }
      />
      <TextField
        label='Delivery Address'
        multiline
        rows={3}
        value={address}
        onChange={e => setAddress(e.target.value)}
        required
        placeholder='Enter your address'
        className='col-span-2'
      />
    </div>
  )
}
