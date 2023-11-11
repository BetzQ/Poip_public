import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Container,
} from '@mui/material'

function ChangePassword() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [reenterPassword, setReenterPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('')

  const handleSendVerificationCode = async () => {
    setErrorMessage('')
    setLoadingMessage('tunggu...')
    try {
      if (!email || !password || !newPassword || newPassword !== reenterPassword) {
        setLoadingMessage('')
        setErrorMessage('Please fill in all fields and ensure new passwords match');
        return;
      }
  
      const authToken = sessionStorage.getItem('authToken')
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authToken, email, password }),
      });
  
      if (response.status === 200) {
        setLoadingMessage('')
        setErrorMessage('')
        setSuccessMessage('Verification code has been sent to your email.');
      } else {
        setLoadingMessage('')
        setErrorMessage('Error sending verification code');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  const handleChangePassword = async () => {
    setErrorMessage('')
    setLoadingMessage('tunggu...')
    try {
      if (newPassword !== reenterPassword) {
        setLoadingMessage('')
        setErrorMessage('Passwords do not match');
        return;
      }

      if (!verificationCode) {
        setErrorMessage('verification code must be filled in')
        setLoadingMessage('')
        return;
      }
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode, newPassword }),
      });
  
      if (response.status === 200) {
        setLoadingMessage('')
        setVerificationCode('')
        setSuccessMessage('Password has been changed successfully.');
      } else {
        setLoadingMessage('')
        setErrorMessage('Error changing password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  return (
    <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom sx={{ textAlign:'center',paddingTop:'.5em' }}>
            Change Password
          </Typography>
      <Card variant="outlined" style={{ padding: '1em' }}>
        <CardContent>
          {loadingMessage && (
            <Alert severity="success" style={{ marginBottom: '1em' }}>
              {loadingMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" style={{ marginBottom: '1em' }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" style={{ marginBottom: '1em' }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage !== '' ? (
            <>
              <TextField
                label="Verification Code"
                variant="outlined"
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{ marginTop: '1em' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                style={{ marginTop: '1em' }}
              >
                Send Verification Code
              </Button>
            </>
          ):
          (
            <>
            <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: '1em' }}
          />
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ marginTop: '1em' }}
          />
          <TextField
            label="Re-enter Password"
            variant="outlined"
            fullWidth
            type="password"
            value={reenterPassword}
            onChange={(e) => setReenterPassword(e.target.value)}
            style={{ marginTop: '1em' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendVerificationCode}
            style={{ marginTop: '1em' }}
          >
            Change Password
          </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default ChangePassword
