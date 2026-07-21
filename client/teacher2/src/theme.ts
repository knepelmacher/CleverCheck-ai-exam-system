import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#ff7a00',
      light: '#ff9d3d',
      dark: '#cc6200',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1f2937',
      light: '#374151',
      dark: '#111827',
      contrastText: '#fff',
    },
    background: {
      default: '#faf9f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Rubik", "Assistant", Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(180deg, #faf9f6 0%, #f5f1eb 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          boxShadow:
            '0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(255, 122, 0, 0.06)',
          border: '1px solid rgba(255, 122, 0, 0.08)',
          borderRadius: 20,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow:
              '0 2px 4px rgba(0,0,0,0.06), 0 12px 40px rgba(255, 122, 0, 0.10)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow:
            '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(255, 122, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          padding: '10px 28px',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #ff9d3d 0%, #ff7a00 100%)',
          boxShadow: '0 4px 14px rgba(255, 122, 0, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ffb066 0%, #ff8c1a 100%)',
            boxShadow: '0 6px 20px rgba(255, 122, 0, 0.4)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            boxShadow: '0 4px 14px rgba(255, 122, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)',
          borderBottom: '1px solid rgba(255, 122, 0, 0.08)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderLeft: '1px solid rgba(255, 122, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(255, 122, 0, 0.04)',
            borderBottom: '2px solid rgba(255, 122, 0, 0.12)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            transition: 'box-shadow 0.2s ease',
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 14,
          },
        },
      },
    },
  },
})
