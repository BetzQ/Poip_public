import { useNavigate } from 'react-router-dom'
import './Sidebar.css'
import { Box } from '@mui/material';

function Sidebar() {
  const navigate = useNavigate()

  const handleClick = (url: string) => {
    // Navigasi ke halaman '/home' ketika tombol diklik
    navigate(url)
  }

  return (
    <ul className='sidebar'>
      <Box sx={{ display:{xs:'flex',md:'block'} }}>
      <li onClick={() => handleClick('/')}>
        Home
        <br />
        <p></p>
      </li>
      <li onClick={() => handleClick('/mynotes')}>
        MyNotes<br />
        <p></p>
      </li>
      {/* <li onClick={() => handleClick('/profile')}>
        Profile<br />
        <p></p>
      </li> */}
      <li onClick={() => handleClick('/settings')}>
        Settings<br />
        <p></p>
      </li>
      <li onClick={() => handleClick('/theme')}>
        Theme
        <br />
        <p></p>
      </li>
      </Box>
    </ul>
  )
}

export default Sidebar
