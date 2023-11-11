import { useState,useEffect } from 'react'
import {backgroundOptions} from './assets/images'

function ChangeThemeHandler() {
  const storedTheme = localStorage.getItem('userTheme');
  const parsedTheme = storedTheme ? JSON.parse(storedTheme) : null;

  const [titleColor, setTitleColor] = useState<string>(
    parsedTheme?.titleColor || 'gray'
  );
  const [textColor1, setTextColor1] = useState<string>(
    parsedTheme?.textColor1 || 'gray'
  );
  const [backgroundColor1, setBackgroundColor1] = useState<string>(
    parsedTheme?.backgroundColor1 || 'black'
  );
  const [textColor2, setTextColor2] = useState<string>(
    parsedTheme?.textColor2 || 'gray'
  );
  const [backgroundColor2, setBackgroundColor2] = useState<string>(
    parsedTheme?.backgroundColor2 || 'black'
  );
  const [textColor3, setTextColor3] = useState<string>(
    parsedTheme?.textColor3 || 'gray'
  );
  const [backgroundColor3, setBackgroundColor3] = useState<string>(
    parsedTheme?.backgroundColor3 || 'black'
  );
  const [backgroundValue, setBackgroundValue] = useState<string>(
    parsedTheme?.backgroundValue ||
      backgroundOptions[0]
    
  );

  const handleTextColorChange = (section: string, color: string) => {
    switch (section) {
      case 'title':
        setTitleColor(color)
        break
      case 'section1':
        setTextColor1(color)
        break
      case 'section2':
        setTextColor2(color)
        break
      case 'section3':
        setTextColor3(color)
        break
      default:
        break
    }
  }

  const handleBackgroundColorChange = (section: string, color: string) => {
    switch (section) {
      case 'section1':
        setBackgroundColor1(color)
        break
      case 'section2':
        setBackgroundColor2(color)
        break
      case 'section3':
        setBackgroundColor3(color)
        break
      default:
        break
    }
  }

  const handleAllColorChange = (color: string) => {
    setBackgroundColor1(color)
    setBackgroundColor2(color)
    setBackgroundColor3(color)
  }

  const handleAllTextColorChange = (color: string) => {
    setTextColor1(color)
    setTextColor2(color)
    setTextColor3(color)
  }

  const handleBackgroundChange = (value: string) => {
    setBackgroundValue(value)
  }

  useEffect(() => {
    // Simpan preferensi tema ke localStorage setiap kali state berubah
    const userTheme = {
      titleColor,
      textColor1,
      backgroundColor1,
      textColor2,
      backgroundColor2,
      textColor3,
      backgroundColor3,
      backgroundValue,
    };
    localStorage.setItem('userTheme', JSON.stringify(userTheme));
  }, [
    titleColor,
    textColor1,
    backgroundColor1,
    textColor2,
    backgroundColor2,
    textColor3,
    backgroundColor3,
    backgroundValue,
  ]);

  const styles = {
    section1: {
      borderBottom: `2px solid ${textColor1}`,
      padding: '0.7em 3em',
      background: backgroundColor1,
      color: textColor1,
    },
    section2: {
      borderRight: `2px solid ${textColor2}`,
      flex: '1',
      background: backgroundColor2,
      color: textColor2,
    },
    section3: {
      borderLeft: `2px solid ${textColor3}`,
      flex: '3',
      backgroundSize: 'cover',
      height: '100%',
      backgroundColor: backgroundColor3,
      backgroundImage: `url(${backgroundValue})`,
      color: textColor3,
      width:'100%',
    },
    content: {
      display: 'flex',
      width: '100%',
      height: '90.9%',
    },
  }

  return {
    titleColor,
    textColor1,
    setTextColor1,
    backgroundColor1,
    setBackgroundColor1,
    backgroundValue,
    setBackgroundValue,
    textColor2,
    setTextColor2,
    backgroundColor2,
    setBackgroundColor2,
    textColor3,
    setTextColor3,
    backgroundColor3,
    setBackgroundColor3,
    handleTextColorChange,
    handleBackgroundColorChange,
    handleAllColorChange,
    handleAllTextColorChange,
    handleBackgroundChange,
    styles,
  }
}

export default ChangeThemeHandler
