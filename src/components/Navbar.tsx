import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, Box } from '@mui/material'

interface NavbarProps {
  isLogin: boolean
}

const Navbar: React.FC<NavbarProps> = ({ isLogin }) => {
  const navigate = useNavigate()
  const [isLoginSession, setIsLoginSession] = useState(false)

  const handleClick = (url: string) => {
    // Navigasi ke halaman '/home' ketika tombol diklik
    navigate(url)
  }

  useEffect(() => {
    if (sessionStorage.getItem('authToken') !== null) {
      setIsLoginSession(true)
    }
  }, [])

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <Box sx={{ width: { xs: '40%', md: '100%' }, height: '2em' }} />
      {isLogin === false && isLoginSession === false ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClick('/login')}
        >
          Login
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            sessionStorage.removeItem('authToken')
            localStorage.removeItem('userInfo')
            location.reload()
          }}
        >
          Logout
        </Button>
      )}
    </div>
  )
}

export default Navbar
