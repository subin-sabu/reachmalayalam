
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // Add your theme settings here


  palette: {
    primary: {
      main: '#F12148',
      sub: '#F14621'
    },
    secondary: {
      main: '#181818',
    },
    tertiary: {
      main: '#2196f3',
      contrastText: '#FFFFFF',
    },
  },
  

  // Custome Breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1800,
      xxl: 2500
    },
  },

  // Custom Font Size for body
  typography: {
    // Extend the existing typography with 'body3'
    body3: {
      fontSize: '0.940rem', // Example size
      fontWeight: 400, // Regular weight
      lineHeight: 1.5, // Example line height
    },


    body4: {
      fontSize: '0.775rem', // Example size
      fontWeight: 400, // Regular weight
      lineHeight: 1.5, // Example line height
    },

    body5: {
      fontSize: '0.675rem', // Example size
      fontWeight: 400, // Regular weight
      lineHeight: 1.5, // Example line height
    },


  },

});

export default theme;
