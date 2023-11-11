import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'
import { CardContent } from '@mui/material'

function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [passwordVerification, setPasswordVerification] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    setIsLoading(true)
    if (!name || !username || !email || !password || !passwordVerification) {
      setErrorMessage('All fields are required.')
      return
    }

    if (passwordVerification !== password) {
      setErrorMessage('Password verification is incorrect')
      return
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password }),
      })

      if (response.ok) {
        setIsLoading(false)
        setIsSuccess(
          'Registration successful! Please check your email for verification.',
        )
        setIsVerifying(true) // Aktifkan proses verifikasi
      } else {
        setIsLoading(false)
        const errorData = await response.json()
        setErrorMessage(errorData.message)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    if (!verificationCode) {
      setErrorMessage('Verification code is required.')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: verificationCode }),
      })

      if (response.ok) {
        setIsLoading(false)
        localStorage.setItem(
          'isSuccess',
          'Verification successful! You can now log in.',
        )
        navigate('/login')
      } else {
        setIsLoading(false)
        const errorData = await response.json()
        setErrorMessage(errorData.message)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
    }
  }

  return isLoading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'white',
      }}
    >
      <Typography variant="h4">Register</Typography>

      {isVerifying ? (
        <>
          <Box width="100%" marginBottom="16px">
            <Typography variant="h6" color="green">
              Kode verifikasi telah dikirim ke email Anda.
            </Typography>
            <TextField
              label="Verification Code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Button variant="contained" onClick={handleVerify} color="primary">
            Verify
          </Button>
        </>
      ) : (
        <>
          <Box width="100%" marginBottom="16px">
            <TextField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Box width="100%" marginBottom="16px">
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Box width="100%" marginBottom="16px">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Box width="100%" marginBottom="16px">
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Box width="100%">
            <TextField
              label="Password Verification"
              type="password"
              id="passwordVerification"
              value={passwordVerification}
              onChange={(e) => setPasswordVerification(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
            />
          </Box>
          {errorMessage && (
            <Typography
              variant="body2"
              style={{ color: 'red', marginTop: '16px' }}
            >
              {errorMessage}
            </Typography>
          )}
          {isSuccess && (
            <Typography
              variant="body2"
              style={{ color: 'green', marginTop: '16px' }}
            >
              {isSuccess}
            </Typography>
          )}
          <Button variant="contained" onClick={handleRegister} color="primary">
            Register
          </Button>
        </>
      )}
      <Box marginTop="16px">
        <Typography variant="body2">
          Have already account?{' '}
          <Link
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer' }}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </CardContent>
  )
}

export default Register
