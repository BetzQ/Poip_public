import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { CardContent } from '@mui/material'

function Login({ setIsLogin }: { setIsLogin: (value: boolean) => void }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setIsLoading(true)
    if (!identifier || !password) {
      setErrorMessage('Username/email and password are required.')
      return
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      })

      if (response.ok) {
        setIsLoading(false)
        const data = await response.json()

        sessionStorage.setItem('authToken', data.authToken)

        const userInfo = { username: data.username }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))

        setIsLogin(true)
        setIsSuccess('Login successful!')
        location.reload()
      } else {
        const errorData = await response.json()
        if (errorData.message === 'Unverified') {
          setEmail(errorData.email)
          setIsVerifying(true)
        }
        setIsLoading(false)
        setErrorMessage(errorData.message)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    setIsVerifying(false)
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
        setIsSuccess('Verification successful! You can now log in.')
        setErrorMessage('')
        navigate('/login')
      } else {
        setIsLoading(false)
        setIsVerifying(false)
        const errorData = await response.json()
        setErrorMessage(errorData.message)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const success = localStorage.getItem('isSuccess')
    if (success) {
      setIsSuccess(success)
      localStorage.removeItem('isSuccess')
    }
  }, [])

  if (isVerifying) {
    return (
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
        <Box width="100%" marginBottom="16px">
          <Typography variant="h6" color="green">
            You have not verified your account, type your verification code sent
            in your email.
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
      </CardContent>
    )
  }

  return isLoading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
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
      <Typography variant="h4">Login</Typography>
      <Box width="100%" marginBottom="16px">
        <TextField
          label="Username/Email"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
      <Button variant="contained" onClick={handleLogin} color="primary">
        Login
      </Button>
      <Box marginTop="16px">
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link
            onClick={() => navigate('/register')}
            style={{ cursor: 'pointer' }}
          >
            Register
          </Link>
        </Typography>
      </Box>
      {errorMessage && (
        <Typography variant="body2" style={{ color: 'red', marginTop: '16px' }}>
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
    </CardContent>
  )
}

export default Login
