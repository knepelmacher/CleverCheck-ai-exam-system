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
      default: '#fef9f4',
      paper: '#ffffff',
    },
    success: {
      main: '#22c55e',
    },
  },
  typography: {
    fontFamily: '"Rubik", "Assistant", Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
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
          background: 'linear-gradient(160deg, #fef9f4 0%, #fdf2e4 40%, #fef7f0 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(255, 122, 0, 0.08)',
          border: '2px solid rgba(255, 122, 0, 0.16)',
          borderRadius: 20,
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow:
              '0 4px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(255, 122, 0, 0.12)',
            borderColor: 'rgba(255, 122, 0, 0.28)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'box-shadow 0.3s ease, transform 0.25s ease',
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
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #ff9d3d 0%, #ff7a00 100%)',
          boxShadow: '0 4px 14px rgba(255, 122, 0, 0.30)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ffb066 0%, #ff8c1a 100%)',
            boxShadow: '0 6px 20px rgba(255, 122, 0, 0.42)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            boxShadow: '0 4px 14px rgba(255, 122, 0, 0.12)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.92)',
          borderBottom: '1px solid rgba(255, 122, 0, 0.08)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.03)',
          transition: 'box-shadow 0.3s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.04)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(255, 122, 0, 0.03)',
            borderBottom: '2px solid rgba(255, 122, 0, 0.10)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 122, 0, 0.3)',
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(255, 122, 0, 0.08)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: '#ff7a00',
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
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(255, 122, 0, 0.08)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'scale(1.06)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
})
