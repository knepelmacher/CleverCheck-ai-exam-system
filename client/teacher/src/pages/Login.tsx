import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material'
import {
  Person as PersonIcon,
  Lock as LockIcon,
  School,
  AutoFixHigh,
} from '@mui/icons-material'
import { keyframes } from '@mui/system'
import { useAuth } from '../context/AuthContext'

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-16px) rotate(3deg); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
`

const loginSchema = z.object({
  username: z.string().min(1, 'שם משתמש נדרש'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await signIn(values)
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ההתחברות נכשלה. אנא נסה שנית.'
      setServerError(message)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(165deg, #0f0f1a 0%, #1a1030 35%, #1a0a20 65%, #0f0f1a 100%)',
      }}
    >
      {/* Background animated orbs */}
      {[
        { size: 400, color: 'rgba(255,122,0,0.10)', top: '-10%', left: '-8%', delay: '0s' },
        { size: 300, color: 'rgba(99,102,241,0.08)', bottom: '-8%', right: '-6%', delay: '2s' },
        { size: 200, color: 'rgba(34,197,94,0.06)', top: '50%', left: '60%', delay: '4s' },
      ].map((orb, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(80px)',
            top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
            animation: `${float} ${10 + i * 3}s ease-in-out infinite`,
            animationDelay: orb.delay,
          }}
        />
      ))}

      {/* Grid overlay */}
      <Box
        sx={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Left panel — visual/branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          px: 8,
        }}
      >
        <Box sx={{ maxWidth: 440, textAlign: 'center', animation: `${fadeIn} 0.8s ease-out` }}>
          {/* Floating AI card */}
          <Box
            sx={{
              mb: 5,
              animation: `${float} 5s ease-in-out infinite`,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,122,0,0.20) 0%, rgba(255,122,0,0.05) 100%)',
                border: '2px solid rgba(255,122,0,0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <AutoFixHigh sx={{ fontSize: 48, color: '#ff7a00' }} />
            </Box>
          </Box>

          <Typography
            variant="h2"
            fontWeight={900}
            fontSize="2.4rem"
            mb={2}
            sx={{
              background: 'linear-gradient(135deg, #fff 0%, #ff9d3d 50%, #fff 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ברוכים הבאים
          </Typography>
          <Typography color="rgba(255,255,255,0.50)" fontSize="1.1rem" mb={6} lineHeight={1.8}>
            מערכת בדיקת מבחנים חכמה. התחברו כדי לנהל מבחנים, לעקוב אחר ביצועים ולחסוך שעות של בדיקה ידנית.
          </Typography>

          {/* Feature bullets */}
          <Stack spacing={2.5}>
            {[
              { icon: <AutoFixHigh />, text: 'בדיקת תשובות פתוחות עם AI' },
              { icon: <School />, text: 'ממשק ניהול כיתות חכם' },
            ].map((item) => (
              <Stack key={item.text} direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ color: '#ff7a00', opacity: 0.7 }}>{item.icon}</Box>
                <Typography color="rgba(255,255,255,0.55)" fontSize="0.95rem">
                  {item.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right panel — login form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          p: 3,
        }}
      >
        <Container maxWidth="xs" disableGutters>
          <Box sx={{ animation: `${fadeIn} 0.6s ease-out 0.2s both` }}>
            {/* Logo */}
            <Box textAlign="center" mb={4}>
              <Box
                component="img"
                src="/logo.png"
                alt="Gradex"
                sx={{ height: 48, width: 'auto', mb: 2 }}
              />
              <Box sx={{ width: 48, height: 3, bgcolor: 'primary.main', mx: 'auto', borderRadius: 1 }} />
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="white" gutterBottom>
                    כניסת מורה
                  </Typography>
                  <Typography color="rgba(255,255,255,0.50)" variant="body2">
                    הזן את פרטיך כדי לגשת למערכת
                  </Typography>
                </Box>

                {serverError ? (
                  <Alert severity="error" sx={{ borderRadius: 2, bgcolor: 'rgba(211,47,47,0.12)', color: '#ef5350', border: '1px solid rgba(211,47,47,0.25)' }}>
                    {serverError}
                  </Alert>
                ) : null}

                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={2.5}>
                    <Controller
                      name="username"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="שם משתמש"
                          placeholder="הזן תעודת זהות"
                          required
                          fullWidth
                          error={Boolean(errors.username)}
                          helperText={errors.username?.message}
                          InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.45)' } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: 'rgba(255,255,255,0.35)' }} fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,122,0,0.4)' },
                              '&.Mui-focused fieldset': { borderColor: '#ff7a00' },
                            },
                            '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.4)' },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="סיסמה"
                          type="password"
                          required
                          fullWidth
                          error={Boolean(errors.password)}
                          helperText={errors.password?.message}
                          InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.45)' } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: 'rgba(255,255,255,0.35)' }} fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,122,0,0.4)' },
                              '&.Mui-focused fieldset': { borderColor: '#ff7a00' },
                            },
                            '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.4)' },
                          }}
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      sx={{
                        mt: 1,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #ff7a00 0%, #ff5722 100%)',
                        boxShadow: '0 4px 20px rgba(255,122,0,0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 6px 28px rgba(255,122,0,0.55)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {isSubmitting ? 'מתחבר...' : 'התחבר'}
                    </Button>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                <Typography color="rgba(255,255,255,0.30)" fontSize="0.75rem" textAlign="center">
                  Gradex © 2025 — מוגן בזכויות יוצרים
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
