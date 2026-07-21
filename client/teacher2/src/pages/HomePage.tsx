import { Box, Button, Container, Stack, Typography, Paper, Grid } from '@mui/material'
import { AutoFixHigh, Quiz, Speed, School, TrendingUp } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: <AutoFixHigh sx={{ fontSize: 48 }} />,
    title: 'בדיקה אוטומטית',
    description: 'בינה מלאכותית בודקת תשובות פתוחות ברמת דיוק גבוהה, חוסכת שעות של בדיקה ידנית.',
  },
  {
    icon: <Quiz sx={{ fontSize: 48 }} />,
    title: 'יצירת מבחנים חכמה',
    description: 'בנה מבחנים אמריקאיים, פתוחים, מספריים ונכון/לא נכון בממשק אינטואיטיבי וידידותי.',
  },
  {
    icon: <Speed sx={{ fontSize: 48 }} />,
    title: 'תוצאות מיידיות',
    description: 'התלמידים מקבלים ציונים ומשוב מיד עם סיום המבחן, ללא המתנה.',
  },
  {
    icon: <School sx={{ fontSize: 48 }} />,
    title: 'ניהול כיתות חכם',
    description: 'נהל מורים, תלמידים, כיתות ומבחנים מלוח בקרה מרכזי אחד.',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 48 }} />,
    title: 'מעקב התקדמות',
    description: 'עקוב אחר ביצועי התלמידים לאורך זמן עם גרפים וסטטיסטיקות מפורטות.',
  },
]

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff7a00 0%, #ff5722 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.08)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -40,
            width: 250,
            height: 250,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.06)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Gradex"
            sx={{ height: { xs: 64, md: 88 }, width: 'auto', mb: 2, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          />
          <Typography variant="h5" mb={4} sx={{ opacity: 0.92, fontWeight: 400, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            מערכת בדיקת מבחנים אוטומטית מבוססת AI — חוסכת זמן, משפרת דיוק, ומאפשרת לך להתמקד בהוראה
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#ff7a00',
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              '&:hover': { bgcolor: '#fff3e0' },
            }}
          >
            התחבר עכשיו
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" mb={1}>
          למה Gradex?
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" mb={6} sx={{ maxWidth: 600, mx: 'auto' }}>
          הפלטפורמה החכמה שהופכת את תהליך הבדיקה למהיר, מדויק ופשוט מתמיד
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bottom CTA */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} mb={2}>
            מוכן להתחיל?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            הצטרף לאלפי מורים שכבר חוסכים זמן יקר עם Gradex
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{ px: 6, py: 1.5, fontSize: '1.1rem', fontWeight: 700, borderRadius: 3 }}
          >
            כניסה למערכת
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
