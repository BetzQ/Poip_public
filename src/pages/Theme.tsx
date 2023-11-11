import { useState } from 'react'
import './theme.css'
import { Button, MenuItem, Select } from '@mui/material'
import {backgroundOptions} from '../assets/images'
import { Box } from '@mui/material';

export interface ThemeProps {
  titleColor: string
  textColor1: string
  backgroundColor1: string
  textColor2: string
  backgroundColor2: string
  textColor3: string
  backgroundColor3: string
  handleTextColorChange: (section: string, color: string) => void
  handleBackgroundColorChange: (section: string, color: string) => void
  handleAllColorChange: (color: string) => void
  handleAllTextColorChange: (color: string) => void
  handleBackgroundChange: (value: string) => void
}

function Theme(props: ThemeProps) {
  const {
    titleColor,
    textColor1,
    backgroundColor1,
    textColor2,
    backgroundColor2,
    textColor3,
    backgroundColor3,
    handleTextColorChange,
    handleBackgroundColorChange,
    handleAllColorChange,
    handleAllTextColorChange,
    handleBackgroundChange,
  } = props

  const [selectedBackground, setSelectedBackground] = useState('')

  return (
    <Box sx={{ fontSize:{xs:'.8em',md:'1em'} }}>
      <h3>Theme</h3>
      <Box sx={{ display:{xs:'block',md:'flex'} }} className="input4">
        <div>Pilih Gambar Latar Belakang Section 1:</div>
        <div style={{ display:'flex',alignItems:'center' }}>
        <Select
      value={selectedBackground}
      onChange={(e) => setSelectedBackground(e.target.value)}
      displayEmpty
      sx={{ margin:{xs:'0',md:'0 1em'},fontSize:{xs:'.89em',md:'1em'} }}
    >
      <MenuItem value="" disabled>
        Pilih gambar latar belakang
      </MenuItem>
      {backgroundOptions.map((url, index) => (
        <MenuItem key={index} value={url}>
          Gambar {index + 1}
        </MenuItem>
      ))}
    </Select>
    <Button
      variant="contained"
      onClick={() => handleBackgroundChange(selectedBackground)}
      sx={{ fontSize:{xs:'.6em',md:'.8em'},height:{xs:'6em',md:'3em'},width:'100%' }}
    >
      Setel Latar Belakang
    </Button>
    </div>
      </Box>
      <div className="input5">
        <label>Pilih Warna Teks Untuk Semua:</label>
        <input
          type="color"
          value={textColor3}
          onChange={(e) => handleAllTextColorChange(e.target.value)}
        />
        <label>Pilih Warna Untuk Semua:</label>
        <input
          type="color"
          value={backgroundColor3} // Gunakan salah satu warna dari salah satu section
          onChange={(e) => handleAllColorChange(e.target.value)}
        />
      </div>
      <h3 style={{ marginTop: '1.5em' }}>Custom Theme</h3>
      <div className="input1">
        <label className="main">Title Color</label>
        <input
          type="color"
          value={titleColor}
          onChange={(e) => handleTextColorChange('title', e.target.value)}
        />
      </div>
      <div className="input1">
        <label className="main">Navbar Color</label>
        <label>Border and text</label>
        <input
          type="color"
          value={textColor1}
          onChange={(e) => handleTextColorChange('section1', e.target.value)}
        />
        <br />
        <label>Pilih Warna Latar Belakang Section 1:</label>
        <input
          type="color"
          value={backgroundColor1}
          onChange={(e) =>
            handleBackgroundColorChange('section1', e.target.value)
          }
        />
      </div>
      <div className="input2">
        <label className="main">Sidebar Color</label>
        <label>Pilih Warna Teks Section 2:</label>
        <input
          type="color"
          value={textColor2}
          onChange={(e) => handleTextColorChange('section2', e.target.value)}
        />
        <br />
        <label>Pilih Warna Latar Belakang Section 2:</label>
        <input
          type="color"
          value={backgroundColor2}
          onChange={(e) =>
            handleBackgroundColorChange('section2', e.target.value)
          }
        />
      </div>
      <div className="input3">
        <label className="main">Content Color</label>
        <label>Pilih Warna Teks Section 3:</label>
        <input
          type="color"
          value={textColor3}
          onChange={(e) => handleTextColorChange('section3', e.target.value)}
        />
        <br />
        <label>Pilih Warna Latar Belakang Section 3:</label>
        <input
          type="color"
          value={backgroundColor3}
          onChange={(e) =>
            handleBackgroundColorChange('section3', e.target.value)
          }
        />
      </div>
    </Box>
  )
}

export default Theme
