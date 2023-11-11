import { useState } from 'react';
import './App.css';
import ChangeThemeHandler from './ChangeThemeHandler';
import Content from './components/Content';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';

function App() {
  const themeProps = ChangeThemeHandler();
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div style={{ height: '97.6vh' }}>
      <div style={themeProps.styles.section1}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b style={{ color: themeProps.titleColor ?? themeProps.textColor3, marginRight: '2em' }}>Poip</b>
          <Navbar isLogin={isLogin} />
        </div>
      </div>
      <div style={themeProps.styles.content}>
        <Box sx={{ ...themeProps.styles.section2, position:{xs:'fixed',md:'static'}, width:{xs:'100%',md:'static'},bottom:'0' }}>
          <Sidebar />
        </Box>
        <div style={themeProps.styles.section3}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '5px',
              height: '98.3%',
              overflowY: 'scroll',
            }}
          >
            <Content isLogin={isLogin} {...themeProps} setIsLogin={setIsLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
