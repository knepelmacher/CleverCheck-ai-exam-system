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
} from '@mui/material'
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

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
        alignItems: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <Container maxWidth="xs">
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Box
            component="img"
            src="/logo.png"
            alt="Gradex"
            sx={{ height: 56, width: 'auto', mb: 1.5 }}
          />
          <Box sx={{ width: 48, height: 3, bgcolor: 'primary.main', mx: 'auto', borderRadius: 1 }} />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                כניסת מורה
              </Typography>
              <Typography color="text.secondary" variant="body2">
                הזן את פרטיך כדי לגשת למערכת
              </Typography>
            </Box>

            {serverError ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
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
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 4px 16px rgba(255,122,0,0.35)',
                    '&:hover': { boxShadow: '0 6px 24px rgba(255,122,0,0.45)' },
                  }}
                >
                  {isSubmitting ? 'מתחבר...' : 'התחבר'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
