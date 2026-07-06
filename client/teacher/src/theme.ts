import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#ff7a00',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1f2937',
    },
    background: {
      default: '#fff8f2',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 12px 30px rgba(255, 122, 0, 0.12)',
          border: '1px solid rgba(255, 122, 0, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})
