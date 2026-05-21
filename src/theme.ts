import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63',
      light: '#f8bbd0',
      dark: '#c2185b',
    },
    secondary: {
      main: '#ff6f61',
      light: '#ffab91',
    },
    background: {
      default: '#fff5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Dancing Script", cursive',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Dancing Script", cursive',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Dancing Script", cursive',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.8,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(233, 30, 99, 0.1)',
        },
      },
    },
  },
});

export default theme;
