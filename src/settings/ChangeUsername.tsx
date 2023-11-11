import { useState } from 'react'
import { Button, TextField, Typography, Box } from '@mui/material'
import { SettingsProps } from '../pages/Settings'

function ChangeUsername({ posts, setPosts }: SettingsProps) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('')

  // ${import.meta.env.VITE_API_URL}
  const handleSendVerificationCode = async () => {
    setErrorMessage('')
    setLoadingMessage('wait...')

    if (!email || !username) {
      setErrorMessage('Email and username  must be filled in')
      setLoadingMessage('')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/change-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken: sessionStorage.getItem('authToken'),
          email,
          username,
        }),
      })

      if (response.ok) {
        setLoadingMessage('')
        setSuccessMessage('Kode verifikasi telah dikirim ke email Anda.')
      } else {
        const errorData = await response.json()
        setLoadingMessage('')
        setErrorMessage(errorData.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChangeUsername = async () => {
    setErrorMessage('')
    setLoadingMessage('wait...')

    if (!verificationCode) {
      setErrorMessage('verification code must be filled in')
      setLoadingMessage('')
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/verify-change-username`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verificationCode, username }),
        },
      )

      if (response.ok) {
        setLoadingMessage('')
        const data = await response.json()
        localStorage.setItem('userInfo', JSON.stringify({username}))
        const updatedPosts = posts.map((post) =>
          post.username === username
            ? { ...post, username: data.newUsername }
            : post,
        )
        setPosts(updatedPosts)
        setSuccessMessage(data.message)
        setVerificationCode('')
      } else {
        const errorData = await response.json()
        setLoadingMessage('')
        setErrorMessage(errorData.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Box
      style={{
        backgroundColor: 'white',
        padding: '1em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4">Change Username</Typography>
      {loadingMessage && (
        <Typography style={{ color: 'green', margin: '1em 0' }}>
          {loadingMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography style={{ color: 'green', margin: '1em 0' }}>
          {successMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography style={{ color: 'red', margin: '1em 0' }}>
          {errorMessage}
        </Typography>
      )}
      {successMessage !== '' ? (
        <div>
          <TextField
            label="Verification Code"
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangeUsername}
            style={{ margin: '1em 0' }}
          >
            Change Username
          </Button>
        </div>
      ) : (
        <>
          <TextField
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="New Username"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendVerificationCode}
            style={{ margin: '1em 0' }}
          >
            Send Verification Code
          </Button>
        </>
      )}
    </Box>
  )
}

export default ChangeUsername
