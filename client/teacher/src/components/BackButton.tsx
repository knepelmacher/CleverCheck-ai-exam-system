import { Button } from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  /** Where to navigate back to. If omitted, goes one step back in browser history. */
  to?: string
  /** Optional label override (default: "חזרה") */
  label?: string
}

export default function BackButton({ to, label = 'חזרה' }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <Button
      variant="text"
      startIcon={
        <ArrowForwardIcon
          sx={{
            fontSize: 18,
            transition: 'transform 0.2s',
          }}
        />
      }
      onClick={() => (to ? navigate(to) : navigate(-1))}
      sx={{
        alignSelf: 'flex-start',
        color: 'text.secondary',
        fontWeight: 500,
        fontSize: '0.875rem',
        textTransform: 'none',
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        gap: 0.5,
        '&:hover': {
          color: 'primary.main',
          bgcolor: 'rgba(255,122,0,0.08)',
          '& .MuiButton-startIcon': {
            transform: 'translateX(-3px)',
          },
        },
        transition: 'all 0.2s',
      }}
    >
      {label}
    </Button>
  )
}
